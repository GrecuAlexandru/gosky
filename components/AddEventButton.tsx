"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEventAction } from "@/app/actions";

interface AddEventButtonProps {
  onAddEvent: (newEvent: any) => void;
}

export default function AddEventButton({ onAddEvent }: AddEventButtonProps) {
  const router = useRouter(); // Initialize useRouter for redirection
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    country: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    participants: 0,
    start_date: "",
    end_date: "",
  });

  const fetchCoordinates = async () => {
    const query = `${address.street}, ${address.city}, ${address.country}`;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    if (data && data.length > 0) {
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);
    }
  };

  useEffect(() => {
    if (address.street && address.city && address.country) {
      fetchCoordinates();
    }
  }, [address]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const newEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      participants: Number(formData.participants),
      start_date: formData.start_date,
      end_date: formData.end_date,
      latitude,
      longitude,
    };
  
    try {
      // Prepare form data
      const formDataToSend = new FormData();
      Object.entries(newEvent).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });
  
      // Submit data to the server
      await addEventAction(formDataToSend);
  
      onAddEvent(newEvent);
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      // Ensure the dialog closes
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" value={latitude} readOnly placeholder="Auto-filled Latitude" />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" value={longitude} readOnly placeholder="Auto-filled Longitude" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              type="number"
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: Number(e.target.value) })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
