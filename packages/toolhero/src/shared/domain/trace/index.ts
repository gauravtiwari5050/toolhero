import { getNamespace } from "cls-hooked";
import { randomUUID } from "crypto";
import { UniqueEntityID } from "../UniqueEntityID";

export interface ITraceEvent {
  name: string;
  time: Date;
  payload?: any;
}

interface IBoxFun {
  (): Promise<void>;
}

export class Trace {
  private id: string;
  private eventStack: string[] = [];
  private events: ITraceEvent[];
  private constructor(id: string) {
    this.id = id;
    this.events = [];
  }
  private async box(name: string, fun: IBoxFun): Promise<void> {
    this.eventStack.push(name);
    try {
      this.emit("START");
      await fun();
      this.emit("END");
      this.eventStack.pop();
    } catch (err) {
      this.emit("END");
      this.eventStack.pop();
      throw err;
    }
  }
  private history(): ITraceEvent[] {
    let baseTime: Date = null;
    const traceEvents = this.events.map((ev) => {
      let delta: number = 0;
      if (baseTime) {
        delta = Math.abs(ev.time.getTime() - baseTime.getTime());
      }
      baseTime = ev.time;
      return {
        id: this.id,
        name: ev.name,
        delta: delta.toString(),
      };
    });

    let maxNameLength = 0;
    let maxTimeLength = 0;
    for (const event of traceEvents) {
      if (event.name.length > maxNameLength) {
        maxNameLength = event.name.length;
      }
      if (event.delta.length > maxTimeLength) {
        maxTimeLength = event.delta.length;
      }
    }

    for (const event of traceEvents) {
      event.name = event.name.padEnd(maxNameLength, " ");
      event.delta = event.delta.padStart(maxTimeLength, " ");
    }
    console.table(traceEvents);

    return this.events;
  }
  private emit(eventName: string, payload?: any): void {
    const name = `${this.id}:${this.eventStack.join(":")}:${eventName}`;
    const time = new Date();
    this.events.push({
      name,
      time,
      payload,
    });
    console.log(`${this.id}:${name}:${time}`, payload);
  }
  public static New(id: string): Trace {
    return new Trace(id);
  }
  public static getTraceFromSession(): Trace {
    const session = getNamespace("CLS");
    return session?.get("context") as Trace;
  }
  public static emit(eventName: string, payload?: any): void {
    const trace = Trace.getTraceFromSession();
    return trace?.emit(eventName, payload);
  }
  public static history(): ITraceEvent[] {
    const trace = Trace.getTraceFromSession();
    return trace?.history();
  }

  public static async box(name: string, fun: IBoxFun) {
    const trace = Trace.getTraceFromSession();
    return trace?.box(name, fun);
  }
}
