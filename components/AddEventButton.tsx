'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addEventAction } from "@/app/actions";

export default function AddEventButton() {
  const [open, setOpen] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    country: "",
  });

  // Function to fetch latitude and longitude
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Validate required fields
    if (!formData.get("start_date") || !formData.get("end_date")) {
      alert("Start date and end date are required!");
      return;
    }

    formData.set("latitude", latitude);
    formData.set("longitude", longitude);
    await addEventAction(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Event</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto pr-2 space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Event Title" required />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Event Description" required />
            </div>

            {/* Address Fields */}
            <div>
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                placeholder="Street"
                required
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  required
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="Country"
                  required
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                />
              </div>
            </div>

            {/* Start and End Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" name="end_date" type="date" required />
              </div>
            </div>

            {/* Latitude and Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" name="latitude" value={latitude} readOnly placeholder="Auto-filled Latitude" />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" name="longitude" value={longitude} readOnly placeholder="Auto-filled Longitude" />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" placeholder="Capacity" required />
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <Button type="submit" className="w-full">
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
