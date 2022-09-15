import { singleton } from 'tsyringe';
import { config } from '@utils/server-config';
import { mainLogger } from '../../sv_logger';
import { UserService } from '../user/user.service';
import { Request } from '@typings/http';
import { CardDB } from './card.db';
import { sequelize } from '@server/utils/pool';
import { AccountService } from '../account/account.service';
import { CardErrors, GenericErrors, UserErrors } from '@server/../../typings/Errors';
import i18next from '@utils/i18n';
import {
  BlockCardInput,
  Card,
  CreateCardInput,
  InventoryCard,
  UpdateCardPinInput,
} from '@server/../../typings/BankCard';
import { AccountDB } from '../account/account.db';
import { PIN_CODE_LENGTH } from '@shared/constants';
import { GetATMAccountResponse, GetATMAccountInput } from '@server/../../typings/Account';
import { CardEvents } from '@server/../../typings/Events';
import { getFrameworkExports } from '@server/utils/frameworkIntegration';

const logger = mainLogger.child({ module: 'card' });
const isFrameworkIntegrationEnabled = config?.frameworkIntegration?.enabled;

@singleton()
export class CardService {
  cardDB: CardDB;
  accountDB: AccountDB;
  userService: UserService;
  accountService: AccountService;

  constructor(
    CardDB: CardDB,
    userService: UserService,
    accountService: AccountService,
    accountDB: AccountDB,
  ) {
    this.cardDB = CardDB;
    this.accountDB = accountDB;
    this.userService = userService;
    this.accountService = accountService;
  }

  async getCards(req: Request<{ accountId: number }>) {
    const cards = await this.cardDB.getByAccountId(req.data.accountId);
    return cards.map((card) => card.toJSON());
  }

  async getInventoryCards(req: Request): Promise<InventoryCard[]> {
    const user = this.userService.getUser(req.source);

    if (!user) {
      throw new Error(UserErrors.NotFound);
    }

    if (!isFrameworkIntegrationEnabled) {
      logger.error('Phsyical cards are not available without FrameworkIntegration enabled.');
      return [];
    }

    const exports = getFrameworkExports();
    return exports.getCards(user.getSource());
  }

  async getAccountByCard(req: Request<GetATMAccountInput>): Promise<GetATMAccountResponse> {
    logger.silly('Getting account by card.');

    const { cardId, pin } = req.data;
    const card = await this.cardDB.getById(cardId);

    if (!card) {
      logger.error('Card not found');
      throw new Error(GenericErrors.NotFound);
    }

    if (card.getDataValue('isBlocked')) {
      logger.error('The card is blocked');
      throw new Error(CardErrors.Blocked);
    }

    if (pin !== card.getDataValue('pin')) {
      logger.error('Invalid pin');
      throw new Error(CardErrors.InvalidPin);
    }

    const account = await this.accountDB.getAccountById(card.getDataValue('accountId') ?? -1);

    if (!account) {
      logger.error('Card is not bound to any account');
      throw new Error(GenericErrors.NotFound);
    }

    logger.error('Returning account!');
    return { account: account?.toJSON(), card: card.toJSON() };
  }

  async giveCard(src: number, card: Card) {
    if (!isFrameworkIntegrationEnabled) {
      logger.error('Could not give card to player.');
      logger.error('Phsyical cards are not available without FrameworkIntegration enabled.');
      return;
    }

    const exports = getFrameworkExports();
    return exports.giveCard(src, card);
  }

  async blockCard(req: Request<BlockCardInput>) {
    const { cardId, pin } = req.data;
    const card = await this.cardDB.getById(cardId);

    if (!card) {
      throw new Error(GenericErrors.NotFound);
    }

    if (pin !== card.getDataValue('pin')) {
      throw new Error(CardErrors.InvalidPin);
    }

    try {
      await card.update({ isBlocked: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateCardPin(req: Request<UpdateCardPinInput>): Promise<boolean> {
    logger.silly('Ordering new card for source:' + req.source);

    const { cardId, newPin, oldPin } = req.data;
    const card = await this.cardDB.getById(cardId);

    if (!card) {
      throw new Error(GenericErrors.NotFound);
    }

    if (card.getDataValue('pin') !== oldPin) {
      throw new Error(CardErrors.InvalidPin);
    }

    const t = await sequelize.transaction();
    try {
      await card.update({ pin: newPin }, { transaction: t });
      t.commit();
      return true;
    } catch (error) {
      logger.error(error);
      t.rollback();
      return false;
    }
  }

  async orderPersonalCard(req: Request<CreateCardInput>): Promise<Card | null> {
    logger.debug('Ordering new card for source:' + req.source);
    const { accountId, paymentAccountId, pin } = req.data;

    const user = this.userService.getUser(req.source);
    const newCardCost = config.cards?.cost;

    if (!newCardCost) {
      logger.error('Missing "cards.cost" in config.json');
      throw new Error(CardErrors.MissingConfigCost);
    }

    if (pin.toString().length !== PIN_CODE_LENGTH) {
      logger.error('Pin is wrong length, should be: ' + PIN_CODE_LENGTH);
      throw new Error(GenericErrors.BadInput);
    }

    const t = await sequelize.transaction();
    try {
      const account = await this.accountService.getAuthorizedAccount(req.source, accountId);
      const paymentAccount = await this.accountService.getAuthorizedAccount(
        req.source,
        paymentAccountId,
      );

      if (!account || !paymentAccount) {
        throw new Error(GenericErrors.NotFound);
      }

      const card = await this.cardDB.create(
        {
          pin: pin,
          holder: user.name,
          holderCitizenId: user.getIdentifier(),
          accountId: account.getDataValue('id'),
        },
        t,
      );

      this.accountService.removeMoneyByAccountNumber({
        ...req,
        data: {
          amount: newCardCost,
          message: i18next.t('Ordered new card'),
          accountNumber: paymentAccount.getDataValue('number'),
        },
      });

      t.afterCommit(() => {
        logger.silly(`Emitting ${CardEvents.NewCard}`);
        emit(CardEvents.NewCard, { ...card.toJSON() });
      });

      this.giveCard(req.source, card.toJSON());

      t.commit();
      return card.toJSON();
    } catch (err) {
      logger.error(err);
      t.rollback();
      throw new Error(i18next.t('Failed to create new account'));
    }
  }
}
