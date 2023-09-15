// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { HeroTool, HeroNextManager, HeroText } from "toolhero";
import { HeroButton } from "toolhero/src/main/valueObjects/HeroButton";
import { HeroLink } from "toolhero/src/main/valueObjects/HeroLink";
import { HeroOutput } from "toolhero/src/main/valueObjects/HeroOutput";
import { HeroTable } from "toolhero/src/main/valueObjects/HeroTable";
import { HeroTableRow } from "toolhero/src/main/valueObjects/HeroTableRow";
const manager = new HeroNextManager();
const tool = HeroTool.New("My First Tool");
manager.add(tool)

tool.input.add(HeroText.New("page").default(async () => { return "9" }))
tool.input.add(HeroText.New("limit"))
tool.functions.register("onApprove", async (context) => {
    console.log({ context })
    return HeroButton.New("Success");
})
tool.run(async (payload, context) => {
    console.log(payload.valueOf("page"))
    const output = HeroOutput.New();
    const table = HeroTable.New();
    table.header.push("Title");
    table.header.push("Action");
    const row = HeroTableRow.New();
    row.add("PM hails Guinness World Record for ‘largest display of Lambani items’ with a total of 1755 items during 3rd G20 Culture Working Group Meeting in Hampi, Karnataka")
    row.add(HeroButton.New("Hello world!").onClick("onApprove").addMetaData("hello", "world"));
    row.add(HeroLink.New("Link to article").to("https://google.com"));


    table.rows.push(row)
    output.add(table);

    return output

})


const method = manager.nextApiHandler();

export default method
