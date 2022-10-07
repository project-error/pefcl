import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import { GetATMAccountInput, GetATMAccountResponse } from '@server/../../typings/Account';
import {
  BlockCardInput,
  Card,
  CreateCardInput,
  DeleteCardInput,
  GetCardInput,
  InventoryCard,
  UpdateCardPinInput,
} from '@server/../../typings/BankCard';
import { AccountEvents, CardEvents } from '@typings/Events';
import { Request, Response } from '@typings/http';
import { Controller } from '../../decorators/Controller';
import { EventListener } from '../../decorators/Event';
import { CardService } from './card.service';

@Controller('Card')
@EventListener()
@PromiseEventListener()
export class CardController {
  cardService: CardService;
  constructor(cardService: CardService) {
    this.cardService = cardService;
  }

  @NetPromise(AccountEvents.GetAtmAccount)
  async getAtmAccount(req: Request<GetATMAccountInput>, res: Response<GetATMAccountResponse>) {
    try {
      const result = await this.cardService.getAccountByCard(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CardEvents.OrderPersonal)
  async orderPersonalAccount(req: Request<CreateCardInput>, res: Response<Card | null>) {
    try {
      const result = await this.cardService.orderPersonalCard(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CardEvents.Block)
  async blockCard(req: Request<BlockCardInput>, res: Response<boolean>) {
    try {
      const isUpdated = await this.cardService.blockCard(req);
      res({ status: 'ok', data: isUpdated });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CardEvents.Delete)
  async deleteCard(req: Request<DeleteCardInput>, res: Response<boolean>) {
    try {
      const isDeleted = await this.cardService.blockCard(req);
      res({ status: 'ok', data: isDeleted });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CardEvents.UpdatePin)
  async updatePin(req: Request<UpdateCardPinInput>, res: Response<boolean>) {
    try {
      const isUpdated = await this.cardService.updateCardPin(req);
      res({ status: 'ok', data: isUpdated });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  @NetPromise(CardEvents.Get)
  async getCards(req: Request<GetCardInput>, res: Response<Card[]>) {
    try {
      const result = await this.cardService.getCards(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }

  /* Return cards from player inventory to be selected at ATM */
  @NetPromise(CardEvents.GetInventoryCards)
  async getInventoryCards(req: Request, res: Response<InventoryCard[]>) {
    try {
      const result = await this.cardService.getInventoryCards(req);
      res({ status: 'ok', data: result });
    } catch (error) {
      res({ status: 'error', errorMsg: error.message });
    }
  }
}
