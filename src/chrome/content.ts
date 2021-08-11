/* global chrome */

import {
    ChromeMessage,
    Sender
} from "../types";

type MessageResponse = (response?: any) => void

const validateSender = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender
) => {
    console.log(message)
    return sender.id === chrome.runtime.id && message.from === Sender.React;
}

const messagesFromReactAppListener = (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    response: MessageResponse
) => {

    const isValidated = validateSender(message, sender);

    if (isValidated) {
        console.log(message.message)
        response('Hello from content.js');
    }

}

const updateFinishedListener = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
    ) => {
        if (changeInfo.status === 'complete') {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["./foreground.js"]
            })
                .then(() => {
                    console.log("INJECTED THE FOREGROUND SCRIPT.");
                })
                .catch(err => console.log(err));
    }
}

const main = () => {
    console.log('[content.ts] Main')
    chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
    chrome.tabs.onUpdated.addListener(updateFinishedListener)
}

main();


