import {Action, action, DidReceiveSettingsEvent, route, SingletonAction, WillAppearEvent} from "@elgato/streamdeck";
import {CounterSettings} from "../../CounterSettings";
import * as crypto from "node:crypto";

/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "gg.dennis.routing-test.increment" })
export class IncrementCounter extends SingletonAction<CounterSettings> {

	@route("/failRoute")
	failRoute() {
		return crypto.randomInt(10);
	}

	draw(action: Action, settings: CounterSettings) {
		const successful = settings.successfulRuns ?? 0;
		const unsuccessful = settings.unsuccessfulRuns ?? 0;
		const totalRuns = successful + unsuccessful;
		let failPercentFormatted: string;

		if (totalRuns === 0) {
			failPercentFormatted = "0%";
		} else {
			failPercentFormatted = `${(unsuccessful / totalRuns * 100).toFixed(1)}%`;
		}

		return action.setTitle(`RUNS: ${totalRuns}\nFAILS: ${unsuccessful}\nFAIL%: ${failPercentFormatted}`);
	}

	onWillAppear(ev: WillAppearEvent<CounterSettings>): void | Promise<void> {
		return this.draw(ev.action, ev.payload.settings);
	}

	onDidReceiveSettings(ev: DidReceiveSettingsEvent<CounterSettings>) {
		return this.draw(ev.action, ev.payload.settings);
	}
}
