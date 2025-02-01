import DataURIParser from "datauri/parser";
import path, { extname } from "path"

const getDataUrl=(file)=>
    {
        const parser=new DataURIParser();

        const ext=path.extname(file.orignalname).toString()
        return parser.format(extName,file.buffer)
    }

    export default getDataUrl;