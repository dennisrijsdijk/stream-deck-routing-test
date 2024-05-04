import streamDeck, {ActionInfo} from "@elgato/streamdeck";
import {CounterSettings} from "../CounterSettings";

streamDeck.onDidConnect(async (_, actionInfo: ActionInfo) => {
    let settings = actionInfo.payload.settings as CounterSettings;

    if (Object.keys(settings).length === 0) {
        settings = {
            successfulRuns: 0,
            unsuccessfulRuns: 0
        }
        await streamDeck.settings.setSettings(settings);
    }

    let error: boolean = false;

    for (let idx = 0; idx < 5; idx++) {
        // Commenting the console.log can make the issue more likely to occur
        console.log(`request #${idx}`)
        const response = await streamDeck.plugin.fetch("/failRoute");
        if (!response.ok) {
            // We don't need to comment this one. Once we're in a 408 failure state, we never get out.
            console.log(`code: ${response.status}`);
            error = true;
        } else {
            // Commenting the console.log can make the issue more likely to occur
            console.log(`value: ${response.body}`)
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 25));
    }
    if (error) {
        settings.unsuccessfulRuns++;
    } else {
        settings.successfulRuns++;
    }
    await streamDeck.settings.setSettings(settings);
});