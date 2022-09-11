import { NetPromise, PromiseEventListener } from '@decorators/NetPromise';
import {
  BlockCardInput,
  Card,
  CreateCardInput,
  GetCardInput,
  UpdateCardPinInput,
} from '@server/../../typings/BankCard';
import { CardEvents } from '@typings/Events';
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
}
