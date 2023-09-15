import { NextApiRequest, NextApiResponse } from 'next';
import { HeroTool } from '../main/valueObjects/HeroTool';
import { HeroRequest } from './HeroRequest';
import { HeroResponse } from './HeroResponse';
import { Router } from './routes/Router';
import { ErrorCodes } from '../shared/domain/ErrorCodes';
import RouteParser from "route-parser"
import { rootRouter } from '../main/infra/http/rootRouter';



export type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export class HeroNextManager {
  private tools: HeroTool[];
  constructor() {
    this.tools = [];
  }
  public add(tool: HeroTool): void {
    this.tools.push(tool);
  }

  public getTools(): HeroTool[] {
    return this.tools;
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
  public nextApiHandler(_inputHandler?: NextApiHandler) {
    const self = this;
    async function Handler(
      vercelRequest: NextApiRequest,
      vercelResponse: NextApiResponse
    ) {


      // build request and response objects for routing
      const req = new HeroRequest(vercelRequest);
      const res = new HeroResponse(vercelResponse);

      // initialize router
      const router = new Router();

      // mount root  and use root routes
      router.use("/", rootRouter);
      const routes = router.routes();

      // clean incoming url and ready it for processing
      let effectiveUrl = (req.query['r'] as string || "")
        .replace(/\/\/+/g, "/")
        .replace(/\/$/, "");
      if (effectiveUrl === "") {
        effectiveUrl = "/"
      }

      console.log({ effectiveUrl });


      // iterate over list of mounted routes
      for (const route of routes) {
        // get the cleaned path for the route
        let effectivePath = route.path.replace(/\/\/+/g, "/").replace(/\/$/, "");
        if (effectivePath === "") {
          effectivePath = "/";
        }

        // load parser
        const routeParser = new RouteParser(effectivePath);
        const params = routeParser.match(effectiveUrl);

        // execute route handler
        if (params !== false && req.method === route.method) {
          req.params = params;
          try {
            const middlewares = route.middlewares;
            for (const middleware of middlewares) {
              await middleware(req, res, { manager: self });
              if (res.terminated === true) {
                return;
              }
            }
            await route.handler(req, res, { manager: self });
            return;
          } catch (err) {
            console.error(err);
            return res.error({
              code: ErrorCodes.INTERNAL_SERVER_ERROR,
              status: 500,
              message: "Something went wrong",
            });
          }
        }
      }
      // if none of the routes match, return a 404 response
      res.error({
        code: ErrorCodes.ROUTE_NOT_FOUND,
        message: "Could not find this route",
        status: 404,
      });
    }
    return Handler
  }
}

