export interface GeneratedTicket {
  id: number;
  id_setting_ticket: number;
  date_generated?: string | null;
  time_generated?: string | null;
  arr_number?: number[] | null;
  arr_true_number?: number[] | null;
}

export interface SettingTicket {
  id: number;
  time: number | null;
  price_ticket: number | null;
  percent_fond: number | null;
  is_start: boolean | null;
  size_x: number | null;
  size_y: number | null;
  count_number_row: number | null;
  count_fill_user: number | null;
}
