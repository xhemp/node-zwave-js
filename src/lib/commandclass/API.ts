import { IDriver } from "../driver/IDriver";
import { ZWaveError, ZWaveErrorCodes } from "../error/ZWaveError";
import { Endpoint } from "../node/Endpoint";
import { getCommandClass } from "./CommandClass";
import { CommandClasses } from "./CommandClasses";

/** Used to identify the method on the CC API class that handles setting values on nodes directly */
export const SET_VALUE: unique symbol = Symbol.for("CCAPI_SET_VALUE");
export type SetValueImplementation = ({
	propertyName,
	propertyKey,
	value,
}: {
	propertyName: string;
	propertyKey?: number | string;
	value: unknown;
}) => Promise<void>;

// Since the setValue API is called from a point with very generic parameters,
// we must do narrowing inside the API calls. These two methods are for convenience
export function throwUnsupportedProperty(
	cc: CommandClasses,
	propertyName: string,
): never {
	throw new ZWaveError(
		`${CommandClasses[cc]}: "${propertyName}" is not a supported property`,
		ZWaveErrorCodes.Argument_Invalid,
	);
}

export function throwWrongValueType(
	cc: CommandClasses,
	propertyName: string,
	expectedType: string,
	receivedType: string,
): never {
	throw new ZWaveError(
		`${CommandClasses[cc]}: "${propertyName}" must be of type "${expectedType}", received "${receivedType}"`,
		ZWaveErrorCodes.Argument_Invalid,
	);
}

/** The base class for all CC APIs exposed via `Node.commandClasses.<CCName>` */
export class CCAPI {
	public constructor(
		protected readonly driver: IDriver,
		protected readonly endpoint: Endpoint,
	) {
		this.ccId = getCommandClass(this);
	}

	protected readonly ccId: CommandClasses;

	protected [SET_VALUE]: SetValueImplementation | undefined;
	public get setValue(): SetValueImplementation | undefined {
		return this[SET_VALUE];
	}

	/**
	 * Retrieves the version of the given CommandClass this node implements
	 */
	public get version(): number {
		return this.endpoint.getCCVersion(this.ccId);
	}

	/** Determines if this simplified API instance may be used. */
	public isSupported(): boolean {
		return (
			// NoOperation is always supported
			// TODO: find out if there are other CCs always supported
			this.ccId === CommandClasses["No Operation"] ||
			this.endpoint.supportsCC(this.ccId) ||
			this.endpoint.controlsCC(this.ccId)
		);
	}
}

// This interface is auto-generated by maintenance/generateCCAPIInterface.ts
// Do not edit it by hand or your changes will be lost
export interface CCAPIs {
	Basic: import("./BasicCC").BasicCCAPI;
	Battery: import("./BatteryCC").BatteryCCAPI;
	"Binary Sensor": import("./BinarySensorCC").BinarySensorCCAPI;
	"Binary Switch": import("./BinarySwitchCC").BinarySwitchCCAPI;
	"Central Scene": import("./CentralSceneCC").CentralSceneCCAPI;
	"Climate Control Schedule": import("./ClimateControlScheduleCC").ClimateControlScheduleCCAPI;
	Configuration: import("./ConfigurationCC").ConfigurationCCAPI;
	"Manufacturer Specific": import("./ManufacturerSpecificCC").ManufacturerSpecificCCAPI;
	"Multi Channel": import("./MultiChannelCC").MultiChannelCCAPI;
	"Multi Command": import("./MultiCommandCC").MultiCommandCCAPI;
	"Multilevel Sensor": import("./MultilevelSensorCC").MultilevelSensorCCAPI;
	"Multilevel Switch": import("./MultilevelSwitchCC").MultilevelSwitchCCAPI;
	"No Operation": import("./NoOperationCC").NoOperationCCAPI;
	Notification: import("./NotificationCC").NotificationCCAPI;
	"Thermostat Setback": import("./ThermostatSetbackCC").ThermostatSetbackCCAPI;
	"Thermostat Setpoint": import("./ThermostatSetpointCC").ThermostatSetpointCCAPI;
	Version: import("./VersionCC").VersionCCAPI;
	"Wake Up": import("./WakeUpCC").WakeUpCCAPI;
	"Z-Wave Plus Info": import("./ZWavePlusCC").ZWavePlusCCAPI;
}
