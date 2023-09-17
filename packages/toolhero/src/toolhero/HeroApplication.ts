import {
  Router as ExpressRouter,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { NextApiRequest, NextApiResponse } from 'next';
import { ToolRenderService } from '../main/services/ToolRenderService';
import { HeroTool } from '../main/valueObjects/HeroTool';
import {
  IHeroManager,
  IHeroUser,
  EnumUserRole,
} from './management/IHeroManager';

export type NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

export class HeroApplication {
  private key: string;
  private tools: HeroTool[];
  private manager?: IHeroManager;
  constructor(args: { secret: string; manager?: IHeroManager }) {
    this.key = args.secret;
    this.manager = args.manager;
    this.tools = [];
  }
  public add(tool: HeroTool): void {
    this.tools.push(tool);
  }

  public getTools(): HeroTool[] {
    return this.tools;
  }

  public expressHandler(): ExpressRouter {
    const expressRouter = ExpressRouter();
    expressRouter.get(
      '/',
      async (request: ExpressRequest, response: ExpressResponse) => {
        if (!request.query.tool) {
          return response.status(404).json({
            code: 'TOOL_NOT_PROVIDED',
            message: 'Please provide a tool name',
            status: 404,
          });
        }
        const toolRenderService = new ToolRenderService(this.tools[0]);
        // if none of the routes match, return a 404 response
        const html = await toolRenderService.render();
        response.status(200).setHeader('Content-Type', 'text/html').send(html);
      }
    );
    return expressRouter;
  }
  /*
  private async handleGet(request: NextApiRequest,
    nextResponse: NextApiResponse): Promise<void> {

    // build request and response objects for routing
    // const req = new HeroRequest(nextRequest);
    const res = new HeroNextHttpResponse(nextResponse);
    if (!request.query.tool) {
      return res.error({
        code: 'TOOL_NOT_PROVIDED',
        message: 'Please provide a tool name',
        status: 404,
      });
    }

    const toolRenderService = new ToolRenderService(this.tools[0]);
    // if none of the routes match, return a 404 response
    //const html = 
    res.okHtml(await toolRenderService.render());
  }

  private async handlePost(request: NextApiRequest,
    nextResponse: NextApiResponse): Promise<void> {

    // build request and response objects for routing
    // const req = new HeroRequest(nextRequest);
    const res = new HeroNextHttpResponse(nextResponse);
    const tool = this.tools[0];
    const heroInput = HeroInput.deserialise(request.body.tool.input);
    if (!request.query.tool) {
      return res.error({
        code: 'TOOL_NOT_PROVIDED',
        message: 'Please provide a tool name',
        status: 404,
      });
    }

    const response = await tool.onSubmit(heroInput, {});
    const json = {
      output: response.serialise()
    }
    console.log(json);
    res.json(json)
  }*/
}
