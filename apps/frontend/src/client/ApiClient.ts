import axios from "axios";
import { IHeroButtonSerialised } from "toolhero/src/main/valueObjects/HeroButton";
import { HeroFunctionOutputSerialised } from "toolhero/src/main/valueObjects/HeroFunctions";
import { IHeroOutputSerialized } from "toolhero/src/main/valueObjects/HeroOutput";
import { IHeroToolSerialised } from "toolhero/src/main/valueObjects/HeroTool";
import { Result } from "toolhero/src/shared/core/Result";

export interface IApiClient {
    runTool(tool: IHeroToolSerialised): Promise<Result<IHeroOutputSerialized>>
}

export class ApiClient implements IApiClient {
    private baseUrl: string;
    private buildUrl(path: string): string {
        const url = new URL(this.baseUrl);
        url.search = new URLSearchParams({ r: path }).toString();
        return url.toString();
    }
    constructor() {
        const url = new URL(window.location.href);
        url.hash = '';
        url.search = '';
        this.baseUrl = url.toString();
    }
    async runTool(tool: IHeroToolSerialised): Promise<Result<IHeroOutputSerialized>> {
        try {
            const url = this.buildUrl(`/api/v1/tool/${tool.name}/run`);
            const response = await axios.post<{ output: IHeroOutputSerialized }>(url, { tool });
            const { output } = response.data;
            return Result.ok(output)
        } catch (err) {
            return Result.fail({
                code: "TOOL_EXECUTION_ERROR",
                message: (err as Error)?.message
            })
        }
    }

    async onButtonClick(tool: IHeroToolSerialised, button: IHeroButtonSerialised): Promise<Result<HeroFunctionOutputSerialised>> {
        try {
            const url = this.buildUrl(`/api/v1/tool/${tool.name}/button/onClick`);
            const response = await axios.post<{ output: HeroFunctionOutputSerialised }>(url, { tool, button });
            const { output } = response.data;
            return Result.ok(output)
        } catch (err) {
            return Result.fail({
                code: "TOOL_EXECUTION_ERROR",
                message: (err as Error)?.message
            })
        }
    }

}