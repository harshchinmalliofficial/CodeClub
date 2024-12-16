import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import axios from "axios";
import moment from "moment";

import {
  Trophy,
  Music,
  Code,
  Users,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminNavbar from "./Admin_components/AdminNavbar";

const API_URL = "http://localhost:9090/Addevents";
const API_GET_EVENTS = "http://localhost:9090/getEVE";

const eventTypes = [
  { value: "code", label: "Code Events", icon: Code, color: "#3B82F6" },
  {
    value: "cultural",
    label: "Cultural Events",
    icon: Music,
    color: "#EC4899",
  },
  { value: "sports", label: "Sports Events", icon: Trophy, color: "#10B981" },
  { value: "conference", label: "Conferences", icon: Users, color: "#8B5CF6" },
  { value: "fest", label: "Fests", icon: PartyPopper, color: "#F59E0B" },
  { value: "other", label: "Other Events", icon: Sparkles, color: "#6B7280" },
];

const EventTypeIcon = ({ type }) => {
  const eventType = eventTypes.find((et) => et.value === type) || eventTypes[5];
  const Icon = eventType.icon;
  return <Icon className="mr-2 h-4 w-4" />;
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    eventType: "code",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(API_GET_EVENTS);
      const formattedEvents = response.data.map((event) => ({
        ...event,
        start: moment(event.start).toDate(),
        end: moment(event.end).toDate(),
      }));
      setEvents(formattedEvents);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !newEvent.title ||
      !newEvent.start ||
      !newEvent.end ||
      !newEvent.eventType
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (new Date(newEvent.end) <= new Date(newEvent.start)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        ...newEvent,
        type: newEvent.eventType,
      });
      setEvents([...events, response.data]);
      setNewEvent({
        title: "",
        start: "",
        end: "",
        eventType: "code",
      });
      setSuccess("Event added successfully!");
      fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error("Error adding event:", err);
      setError("Failed to add event. Please try again.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#A94442]">
          Event Calendar
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 bg-white shadow-xl rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#A94442]">
              Add New Event
            </h2>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 bg-green-100 border-green-400 text-green-700">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Event Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A94442] focus:ring focus:ring-[#A94442] focus:ring-opacity-50"
                />
              </div>
              <div>
                <Label
                  htmlFor="eventType"
                  className="text-sm font-medium text-gray-700"
                >
                  Event Type
                </Label>
                <Select
                  value={newEvent.eventType}
                  onValueChange={(value) =>
                    setNewEvent({ ...newEvent, eventType: value })
                  }
                >
                  <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A94442] focus:ring focus:ring-[#A94442] focus:ring-opacity-50">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon
                            className="mr-2 h-4 w-4"
                            style={{ color: type.color }}
                          />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="start"
                  className="text-sm font-medium text-gray-700"
                >
                  Start Date and Time
                </Label>
                <Input
                  id="start"
                  name="start"
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A94442] focus:ring focus:ring-[#A94442] focus:ring-opacity-50"
                />
              </div>
              <div>
                <Label
                  htmlFor="end"
                  className="text-sm font-medium text-gray-700"
                >
                  End Date and Time
                </Label>
                <Input
                  id="end"
                  name="end"
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A94442] focus:ring focus:ring-[#A94442] focus:ring-opacity-50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#A94442] text-white py-2 px-4 rounded-md hover:bg-[#923A38] transition-colors duration-200"
              >
                Add Event
              </Button>
            </form>
          </div>

          <div className="lg:w-2/3 bg-white shadow-xl rounded-lg overflow-hidden">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={events}
              eventContent={(eventInfo) => (
                <div className="flex items-center p-1">
                  <EventTypeIcon
                    type={eventInfo.event.extendedProps.eventType}
                  />
                  <span className="text-sm font-medium">
                    {eventInfo.event.title}
                  </span>
                </div>
              )}
              height="auto"
            />
          </div>
        </div>

        <style jsx global>{`
          .fc-toolbar-title {
            color: #a94442 !important;
            font-weight: bold !important;
          }
          .fc-button-primary {
            background-color: #a94442 !important;
            border-color: #a94442 !important;
          }
          .fc-button-primary:hover {
            background-color: #923a38 !important;
            border-color: #923a38 !important;
          }
          .fc-button-active {
            background-color: #923a38 !important;
            border-color: #923a38 !important;
          }
          .fc-daygrid-day.fc-day-today {
            background-color: rgba(169, 68, 66, 0.1) !important;
          }
          .fc-event {
            border: none !important;
            padding: 2px !important;
            margin: 1px 0 !important;
          }
          .fc-header-toolbar {
            margin-bottom: 1rem !important;
            padding: 0.5rem !important;
          }
          .fc th {
            padding: 10px 0 !important;
            background-color: #a94442 !important;
            color: white !important;
          }
        `}</style>
      </div>
    </>
  );
}
