import { FeatureGroup, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import L, { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo } from "react";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
});

L.Marker.prototype.options.icon = DefaultIcon;

function MapsTest() {
  const { data, isLoading } = useQuery({
    queryKey: ["maps"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:3000/api/maps");

      return data.directions as google.maps.DirectionsResult;
    },
  });

  const dataPosition = useMemo(
    () =>
      data?.routes.map((route) =>
        route.legs.map((leg) => {
          const { start_location, end_location } = leg;
          return [
            {
              lat: start_location.lat,
              lng: start_location.lng,
            },
            {
              lat: end_location.lat,
              lng: end_location.lng,
            },
          ] as unknown as LatLngLiteral[];
        })
      ),
    [data]
  );

  useEffect(() => {
    console.log({ data, dataPosition });
  }, [data, dataPosition]);

  if (isLoading || !data || !dataPosition) return null;

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom className="size-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://www.google.com/maps/vt?lyrs=m@189&gl=en&x={x}&y={y}&z={z}"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <FeatureGroup>
        {/* TODO: i am dumb 2 */}
        {/* {dataPosition?.map((mark, i) => (
          <div key={i}>
            {mark.map((value) => (
              <Marker key={i} position={value} />
            ))}
          </div>
        ))} */}

        {/* TODO: i am dumb */}
        {/* {dataPosition?.at(0)?[0] !== undefined && (

        )} */}

        {dataPosition?.map((value, i) => (
          <Polyline key={i} positions={value || []} color="red" />
        ))}
      </FeatureGroup>
    </MapContainer>
  );
}

export default MapsTest;
