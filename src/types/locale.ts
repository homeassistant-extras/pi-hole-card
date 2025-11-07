/**
 * Translation keys for the application.
 */
export type TranslationKey =
  | 'card.stats.total_queries'
  | 'card.stats.active_clients'
  | 'card.stats.queries_blocked'
  | 'card.stats.list_blocked_queries'
  | 'card.stats.percentage_blocked'
  | 'card.stats.list_all_queries'
  | 'card.stats.domains_on_lists'
  | 'card.stats.manage_lists'
  | 'card.sections.pause'
  | 'card.sections.switches'
  | 'card.sections.actions'
  | 'card.units.seconds'
  | 'card.units.second'
  | 'card.units.minutes'
  | 'card.units.minute'
  | 'card.units.hours'
  | 'card.units.hour'
  | 'card.ui.select_pi_or_group'
  | 'card.ui.partial'
  | 'editor.space_around'
  | 'editor.space_between'
  | 'editor.actions'
  | 'editor.footer'
  | 'editor.header'
  | 'editor.pause_buttons'
  | 'editor.statistics'
  | 'editor.sensors'
  | 'editor.switches'
  | 'editor.tap_action'
  | 'editor.hold_action'
  | 'editor.double_tap_action'
  | 'editor.content'
  | 'editor.card_title'
  | 'editor.card_icon'
  | 'editor.layout'
  | 'editor.sections_to_exclude'
  | 'editor.sections_collapsed_by_default'
  | 'editor.style_for_switches'
  | 'editor.entities_to_exclude'
  | 'editor.styles'
  | 'editor.switch_spacing'
  | 'editor.interactions'
  | 'editor.pause_durations'
  | 'editor.badge'
  | 'editor.information'
  | 'editor.controls'
  | 'editor.features'
  | 'editor.disable_group_pausing'
  | 'editor.pause_60_seconds'
  | 'editor.pause_5_minutes'
  | 'editor.pause_15_minutes'
  | 'editor.pi_hole_device'
  | 'editor.entity_display_order'
  | 'editor.flex_default'
  | 'editor.chart'
  | 'editor.chart_line_type'
  | 'editor.chart_line_type_normal'
  | 'editor.chart_line_type_gradient'
  | 'editor.chart_line_type_gradient_no_fill'
  | 'editor.chart_line_type_no_fill';

export interface Translation {
  /** The translation key */
  key: TranslationKey;

  /** The translation string */
  search: string;

  /** The string to replace the search string with */
  replace: string;
}
