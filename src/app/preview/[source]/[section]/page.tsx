"use client"
import { Box } from "@mui/material";
import { useParams } from "next/navigation";

const Preview = () =>{
    const params = useParams();
    const source = params.source;
    const section = params.section;
    

    return(
        <Box>
            Source : {source} e section : {section}
        </Box>
    )

    
}

export default Preview; 

