"use client";

import { useState, useEffect, useCallback } from "react";
import { Specialty } from "@/types/specialty";
import { MedicalTicket, BookingPayload } from "@/types/ticket";
import { TicketService } from "@/lib/services/ticketService";
import { MOCK_HOSPITALS } from "@/lib/data/mockHospitals";

export function useTickets(hospitalId: string = "hosp-clinicas-lp") {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [tickets, setTickets] = useState<MedicalTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(() => {
    const specs = TicketService.getSpecialties(hospitalId);
    const userTickets = TicketService.getAllTickets();
    setSpecialties(specs);
    setTickets(userTickets);
    setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const bookTicket = (payload: BookingPayload) => {
    const res = TicketService.createBooking(payload);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const checkIn = (ticketId: string) => {
    const res = TicketService.checkInTicket(ticketId);
    if (res.success) {
      refreshData();
    }
    return res;
  };

  const resetAll = () => {
    TicketService.resetToDefault();
    refreshData();
  };

  const currentHospital = MOCK_HOSPITALS.find((h) => h.id === hospitalId) || MOCK_HOSPITALS[0];

  return {
    specialties,
    tickets,
    isLoading,
    currentHospital,
    bookTicket,
    checkIn,
    resetAll,
    refreshData,
  };
}
