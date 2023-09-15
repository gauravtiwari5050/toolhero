import { IHeroButtonSerialised } from 'toolhero/src/main/valueObjects/HeroButton';
import { IHeroTableSerialised } from 'toolhero/src/main/valueObjects/HeroTable';
import HeroButton from './HeroButton';
import HeroLink from './HeroLink';
import { IHeroLinkSerialised } from 'toolhero/src/main/valueObjects/HeroLink';

interface IHeroTableProps {
    table: IHeroTableSerialised
}

const HeroTable = ({ table }: IHeroTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-fixed table w-full">
                <thead>
                    <tr>
                        {
                            table.header.items.map((header) => {
                                return <th className="whitespace-normal" id={header}>{header}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        table.rows.map((row) => {
                            return <tr>
                                {
                                    row.items.map((cell) => {
                                        return <td className="whitespace-normal">
                                            {cell.type === "HeroButton" && <HeroButton button={cell.value as IHeroButtonSerialised} />}
                                            {cell.type === "HeroLink" && <HeroLink link={cell.value as IHeroLinkSerialised} />}
                                            {cell.type === "String" && <p>{cell.value as String}</p>}
                                            {cell.type === "Number" && <p>{cell.value?.toString()}</p>}
                                        </td>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default HeroTable;