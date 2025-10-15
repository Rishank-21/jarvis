
import User from "../models/userModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
    export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
         // Return the user data without the password
         res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const updateAssistant = async (req , res ) => {
    try {
        const  { assistantName , imageUrl} = req.body
        let assistantImage;
        if(req.file){
            assistantImage = await uploadOnCloudinary(req.file.path)
        } else {
        
            assistantImage = imageUrl
        }
        const user = await User.findByIdAndUpdate(req.user.id , {
            assistantImage,
            assistantName
        } , { new : true }).select("-password")
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message : "update assistant error"})
    }
}


export const askToAssistant = async ( req , res ) => {
    try{
        const { command } = req.body
        const user = await User.findById(req.user.id);
        user.history.push(command)
        await user.save()
        const userName =  user.name
        const assistantName = user.assistantName;
        const result = await geminiResponse(command , assistantName , userName )

        const jsonMatch = result.match(/{[\s\S]*?}/)
        if(!jsonMatch){
            return res.status(400).json({ message : "sorry i can't understand"})
        }
        const gemResult = JSON.parse(jsonMatch[0]);
        console.log(gemResult)
        const type = gemResult.type

        switch(type){
            case 'get_date':  
            return res.json({
                type ,
                userinput : gemResult.userinput,
                response : `current date is ${moment().format("YYYY-MM-DD")}`   
            });
            case 'get_time' : 
            return res.json({
                type,
                userinput : gemResult.userinput,
                response : `current time is ${moment().format("hh:mm A")}`
            });
            case 'get_day' : 
            return res.json({
                type,
                userinput : gemResult.userinput,
                response : `today is ${moment().format("dddd")}`
            });
            case 'get_month' : 
            return res.json({
                type,
                userinput : gemResult.userinput,
                response : `current month ${moment().format("MMMM")}`
            });
            case 'google_search' : 
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });
            case 'youtube_search' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });  
            case 'youtube_play' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });
            case 'general' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });      
            case 'calculator_open' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });
          
            case 'instagram_open' :
             return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });  
            case 'facebook_open' :
             return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });
            case 'weather_show' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });
            case 'whatsapp_open' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });  
            case 'youtube_open' :
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });   
            case 'gmail_open' : 
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });

             case 'chatgpt_open' : 
            return res.json({
                    type,
                    userinput : gemResult.userinput,
                    response : gemResult.response
            });


            default : 
            return res.status(400).json({ message : "Sorry i didn't understand that command."})
        }
        


    } catch ( error) {
        return res.status(500).json({message : "Ask assistant error"})
    }
}