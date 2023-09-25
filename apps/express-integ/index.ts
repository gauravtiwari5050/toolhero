import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { HeroButton } from "toolhero/src/main/valueObjects/HeroButton";
import { HeroLink } from "toolhero/src/main/valueObjects/HeroLink";
import { HeroOutput } from "toolhero/src/main/valueObjects/HeroOutput";
import { HeroTable } from "toolhero/src/main/valueObjects/HeroTable";
import { HeroTableRow } from "toolhero/src/main/valueObjects/HeroTableRow";
import { HeroText } from "toolhero/src/main/valueObjects/HeroText";
import { HeroTool } from "toolhero/src/main/valueObjects/HeroTool";
import { HeroApplication } from "toolhero/src/toolhero/HeroApplication";
import {
  IHeroContext,
  IHeroManager,
} from "toolhero/src/toolhero/management/IHeroManager";

dotenv.config();

const app = express();
const port = 5050;

export class CustomHeroManager implements IHeroManager {
  async afterSignIn(args: { context: IHeroContext }): Promise<boolean> {
    return true;
  }
}

const heroApp = new HeroApplication({
  secret: "abracadabra",
  manager: new CustomHeroManager(),
  mongoUrl: "mongodb://localhost:27017/toolhero",
});
const tool = HeroTool.New("My First Tool");
heroApp.add(tool);

tool.input.add(
  HeroText.New("page").default(async () => {
    return "9";
  })
);
tool.input.add(HeroText.New("limit"));
tool.functions.register("onApprove", async (context) => {
  console.log({ context });
  return HeroButton.New("Success");
});
tool.run(async (payload, context) => {
  console.log(payload.valueOf("page"));
  const output = HeroOutput.New();
  const table = HeroTable.New();
  table.header.push("Title");
  table.header.push("Action");
  const row = HeroTableRow.New();
  row.add(
    "PM hails Guinness World Record for ‘largest display of Lambani items’ with a total of 1755 items during 3rd G20 Culture Working Group Meeting in Hampi, Karnataka"
  );
  row.add(
    HeroButton.New("Hello world!")
      .onClick("onApprove")
      .addMetaData("hello", "world")
  );
  row.add(HeroLink.New("Link to article").to("https://google.com"));

  table.rows.push(row);
  output.add(table);

  return output;
});

app.use("/mount", heroApp.expressHandler());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
