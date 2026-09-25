import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function startUserTour() {
  driver({
    showProgress: true,
    smoothScroll: true,
    skipMissingElement: true,
    steps: [
      {
        popover: {
          title: "Welcome to your IT Service Desk",
          description: "This quick tour walks you through the main areas.",
        },
      },
      {
        element: "#app-sidebar",
        popover: {
          title: "Navigation",
          description:
            "Use this menu to move between Overview, My Tickets, My Assets, Appointments, and Messages.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#profile-menu-button",
        popover: {
          title: "Your account",
          description: "Open this menu to edit your profile or log out.",
          side: "bottom",
          align: "end",
        },
      },
      {
        popover: {
          title: "Report & track issues",
          description:
            "Create a ticket from My Tickets and follow its status. Your equipment lives under My Assets, and booked visits under Appointments.",
        },
      },
      {
        popover: {
          title: "You're all set",
          description:
            "Need a refresher? Tap the question mark in the top bar any time.",
        },
      },
    ],
  }).drive();
}
