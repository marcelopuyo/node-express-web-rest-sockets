import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";


export class TicketController {

  constructor(
    private readonly ticketService = new TicketService()
  ) {}

  public getTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.tickets);
  }

  public getLastTicketsNumber = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastTicketNumber);
  }

  public pendingTickets = async (req: Request, res: Response) => {
    res.json(this.ticketService.pendingTickets);
  }

  public createTickets = async (req: Request, res: Response) => {
    res.status(201).json(this.ticketService.createTicket());
  }

  public drawTickets = async (req: Request, res: Response) => {
    const { desk } = req.params;

    res.json(this.ticketService.drowTicket(desk));
  }

  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    res.json(this.ticketService.onFinishedTicket(ticketId));
  }

  public workingOn = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastWorkingOnTickets);
  }



}