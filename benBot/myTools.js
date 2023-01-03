require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const { resolve } = require('path');
const configuration = new Configuration({
  apiKey: process.env.GPT_API,
});

const openai = new OpenAIApi(configuration);

// craete commands
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: "yo",
        description: "replies with yo + username"
    },
    {
        name: "prompt",
        description: "makes a request to chat-GPT3 given a prompt",
        options: [
            {
                name:"creativity",
                description: "based on creativiy the AI will take more risk when considering a solution",
                type: 3,
                required: true,
                choices: [
                    {
                        name: "well defined response",
                        value: "wellDefinedResponse"
                    },
                    {
                        name: "minimally creative response",
                        value: "minimalCreativity"
                    },
                    {
                        name: "decently creative response",
                        value: "decentlyCreative"
                    },
                    {
                        name: "very creative response",
                        value: "veryCreative"
                    }
                ]
            },
            {
                name: "request",
                description: "prompt to be executed",
                type: 3,
                required: true
            }
        ]
    }
];


class DavinciBot 
{
    constructor()
    {
        // max tokens used per api call
        this.maxTokensAllowed = 12;
        /*
            determines how creative (or risky) the ai will be in the response 
            ranges between 0 (well defined) - 1 (very creative)
            very creative response are more prone to inacuracy
        */
        this.creativity = new Map(Object.entries({
            "wellDefinedResponse": 0,
            "minimalCreativity": this.randomIntInRange(1,4) % 2,
            "decentlyCreative": this.randomIntInRange(4,8) % 2,
            "veryCreative": this.randomIntInRange(8,11) % 2
        }));

    }
    // creates a random integer within a given range 
    randomIntInRange(minInt,maxInt)
    {
        let num = Math.floor(Math.random() * maxInt)
    
        if (num < minInt)
        {
            num = minInt;
        }
        return num;
    }
    async executeCall(interactionObj)
    {
        let userPrompt = interactionObj.options.get("request").value;
        let creativityChoice = interactionObj.options.get("creativity").value;

        console.log(`${userPrompt} | ${creativityChoice} | ${interactionObj.user.username}`);
        try
        {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: userPrompt,
                temperature: this.creativity.get(creativityChoice)
            });

            console.log(response.data.choices);
            return response.data.choices[0].text;
        }
        catch
        {
            // console.error(err.message);
            return `yo ${interactionObj.user} run that back`;
        }
        // try
        // {
        //     let response = await axios.get("https://stormy-jumper.cyclic.app/F99")
        //     console.log(response)
        //     return `yo ${response.data.vitality} >>>> ${response.data.response}`;
        // }
        // catch
        // {
        //     // console.error(err.message);
        //     return `yo ${interactionObj.user} run that command back`;
        // }
    }
}

// map all responses to one function to manage complexity and streamline events 
class RequestHandler 
{
    constructor(interactionObj)
    {
        this.interactionObj = interactionObj;
        this.chatGPT3Model = new DavinciBot();
        this.apiCommands = [
            "prompt"
        ];
        this.responses = new Map(Object.entries({
            "yo": `sup ${this.interactionObj.user}`,
            "ping": `Pong!`,
            "prompt": new DavinciBot()
        }))
    }

    handlePromise(promise)
    {
        let response;
        
        promise.then(result => {
            response = result;
        }).catch(err => {
            return `Sry there where issues fetching resources`
        })

        return response;
    }
    async respond(request)
    {
        // if the command requires for a call we will wait for it to resolve, else just send the response
        return (this.apiCommands.includes(request))? await this.responses.get(request).executeCall(this.interactionObj): this.responses.get(request);
    }

}

async function testCall() {
    return null
}



module.exports = {
    testCall,
    RequestHandler,
    commands
}