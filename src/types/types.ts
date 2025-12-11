export interface PiHoleSetup {
  /** Some people like to watch ads burn */
  holes: PiHoleDevice[];
}

export interface PiHoleDevice {
  /** Unique identifier for the device */
  device_id: string;

  /** Total DNS Queries */
  dns_queries_today?: EntityInformation;

  /** Total Domains Blocked */
  domains_blocked?: EntityInformation;

  /** Percentage of Ads Blocked Today */
  ads_percentage_blocked_today?: EntityInformation;

  /** Total Ads Blocked Today */
  ads_blocked_today?: EntityInformation;

  /** Total Unique Clients Queried */
  dns_unique_clients?: EntityInformation;

  /** Remaining Time Until Blocking Mode */
  remaining_until_blocking_mode?: EntityInformation;

  /** Button to Refresh data */
  action_refresh_data?: EntityInformation;

  /** Last Data Refresh Time */
  latest_data_refresh?: EntityInformation;

  /** Info message count entity */
  info_message_count?: EntityInformation;

  /** Button to Purge Diagnosis Messages */
  purge_diagnosis_messages?: EntityInformation;

  /** Status of Pi-hole */
  status?: EntityInformation;

  /** CPU usage sensor */
  cpu_use?: EntityInformation;

  /** Memory usage sensor */
  memory_use?: EntityInformation;

  /** Sensors for the Pi-hole */
  sensors: EntityInformation[];

  /** Switches for Pi-hole */
  switches: EntityInformation[];

  /** Control entities for the device */
  controls: EntityInformation[];

  /** Update entities for the device */
  updates: EntityInformation[];
}

export interface EntityInformation extends EntityState {
  /** Translation key */
  translation_key: string | undefined;
}

export interface EntityState {
  /** ID of the entity this state belongs to */
  entity_id: string;

  /** Current state value as a string (e.g., "on", "off", "25.5") */
  state: string;

  /** Additional attributes associated with the state */
  attributes: Record<string, any>;
}
