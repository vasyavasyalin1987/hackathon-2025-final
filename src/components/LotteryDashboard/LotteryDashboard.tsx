import React, { useState } from "react";
import { SettingTicket } from "@/models/lottery";
import { Lottery } from "../Lottery/Lottery";
import { CreateLotteryModal } from "../CreateLottery/CreateLotteryModal";
import styles from "./LotteryDashboard.module.scss";

const mockSettingTicket: SettingTicket[] = [
  {
    id: 10,
    time: 60,
    price_ticket: 100,
    percent_fond: 70,
    is_start: true,
    size_x: 5,
    size_y: 5,
    count_number_row: 1000,
    count_fill_user: 4,
  },
  {
    id: 11,
    time: 60,
    price_ticket: 100,
    percent_fond: 70,
    is_start: true,
    size_x: 5,
    size_y: 5,
    count_number_row: 1000,
    count_fill_user: 4,
  },
  {
    id: 12,
    time: 60,
    price_ticket: 100,
    percent_fond: 70,
    is_start: true,
    size_x: 5,
    size_y: 5,
    count_number_row: 1000,
    count_fill_user: 4,
  },
];

export function LotteryDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSettingId, setSelectedSettingId] = useState<
    number | undefined
  >(undefined);
  const [defaultValues, setDefaultValues] = useState<SettingTicket | undefined>(
    undefined
  );

  const handleEdit = (id_setting_ticket: number) => {
    setSelectedSettingId(id_setting_ticket);
    setDefaultValues(mockSettingTicket[id_setting_ticket]);
    setModalOpen(true);
  };

  return (
    <div>
      <div className={styles.lotteries}>
        {mockSettingTicket.map((ticket) => (
          <Lottery key={ticket.id} ticket={ticket} onEdit={handleEdit} />
        ))}
      </div>
      <CreateLotteryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        settingTicketId={selectedSettingId}
        defaultValues={defaultValues}
      />
    </div>
  );
}
