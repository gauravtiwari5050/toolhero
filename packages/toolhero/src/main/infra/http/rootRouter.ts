import { IRouter } from '../../../toolhero/routes/IRouter';
import { Router } from '../../../toolhero/routes/Router';
import { HeroButtonOnClickHandlerService } from '../../services/HeroButtonOnClickHandlerService';
import { PageRenderService } from '../../services/PageRenderService';
import { ToolRenderService } from '../../services/ToolRenderService';
import {
  HeroButton,
  IHeroButtonSerialised,
} from '../../valueObjects/HeroButton';
import { HeroExecutionContext } from '../../valueObjects/HeroExecutionContext';
import { HeroFunctionOutputSerialised } from '../../valueObjects/HeroFunctions';
import { HeroInput } from '../../valueObjects/HeroInput';

const rootRouter: IRouter = new Router();

rootRouter.GET('/', async (req, res) => {
  return res.internalRedirect('/login');
});

rootRouter.GET('/login', async (req, res) => {
  res.internalRedirect('/welcome/admin/setup');

  /*const pageRenderService = new PageRenderService({
    page: 'login',
    windowVars: {},
  });
  res.okHtml(await pageRenderService.render());*/
});

rootRouter.GET('/welcome/admin/setup', async (req, res) => {
  const pageRenderService = new PageRenderService({
    page: 'adminSetup',
    windowVars: {},
  });
  res.okHtml(await pageRenderService.render());
});

rootRouter.GET('/app', async (req, res, { application: manager }) => {
  const toolRenderService = new ToolRenderService(manager.getTools()[0]);
  res.okHtml(await toolRenderService.render());
});

rootRouter.POST(
  '/api/v1/tool/:tool/run',
  async (req, res, { application: manager }) => {
    // build request and response objects for routing
    // const req = new HeroRequest(nextRequest);

    const tool = manager.getTools()[0];
    const heroInput = HeroInput.deserialise(req.body().tool.input);
    const response = await tool.onSubmit(heroInput, {});
    const json = {
      output: response.serialise('output'),
    };
    console.log(json);
    res.json(json);
  }
);

rootRouter.POST(
  '/api/v1/tool/:tool/button/onClick',
  async (req, res, { application: manager }) => {
    const tool = manager.getTools()[0];
    const context: HeroExecutionContext = {
      event: {
        source: {
          button: req.body().button as IHeroButtonSerialised,
        },
      },
    };
    const clickedButton = HeroButton.deserialise(
      req.body().button as IHeroButtonSerialised
    );
    console.log(clickedButton.onClickHandler);
    const onClickHandlerService = new HeroButtonOnClickHandlerService();
    const heroFunction = tool.functions.find(clickedButton.onClickHandler);
    let output: HeroFunctionOutputSerialised = {
      type: 'HeroVoid',
    };
    const outputOrError = await onClickHandlerService.runHeroFunction({
      heroFunction,
      context,
    });
    if (outputOrError.isFailure) {
      return res.error(outputOrError.error);
    }
    output = outputOrError.getValue();
    const json = {
      output,
    };
    console.log(json);
    res.json(json);
  }
);

export { rootRouter };
