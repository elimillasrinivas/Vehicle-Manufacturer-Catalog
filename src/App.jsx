import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);

  useEffect(() => {
    let count = 1;
    axios
      .get(
        `https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=${count}`
      )
      .then((res) => {
        // console.log(res.data.Results);
        setManufacturers(res.data.Results);
        setFilteredManufacturers(res.data.Results);
        const types = Array.from(
          new Set(res.data.Results.map((m) => m.VehicleTypeName))
        );
        // setVehicleTypes(types);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleManufacturerClick = (manufacturer) => {
    console.log(manufacturer);
    axios(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmanufacturerdetails/${manufacturer.Mfr_ID}?format=json`
    )
      .then((res) => {
        setSelectedManufacturer(res.data.Results);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
    const filtered = manufacturers.filter((m) => {
      // console.log(manufacturers)
      return (
        m.Mfr_Name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        m.Country.toLowerCase().includes(event.target.value.toLowerCase())
      );
    });
    setFilteredManufacturers(filtered);
  };

  const handleFilter = (event) => {
    if (event.target.value === "All") {
      setFilteredManufacturers(manufacturers);
    } else {
      let filtered=[]
      manufacturers.filter((m) => {
        // console.log(m);
        m.VehicleTypes.map((e) => {
        if (e.Name===event.target.value) filtered.push(m)
        });
      });
      console.log(filtered);
      setFilteredManufacturers(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Vehicle Manufacturer Catalog</h1>
      <div className="serach-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
        <select onChange={handleFilter}>
          <option value="All">All</option>
          <option value="Passenger Car">Passenger Car</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Trailer">Trailer</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredManufacturers.map((manufacturer) => (
            <tr
              key={manufacturer.ManufacturerId}
              onClick={() => handleManufacturerClick(manufacturer)}
            >
              <td>{manufacturer.Mfr_Name}</td>
              <td>{manufacturer.Country}</td>
              <td>
                {manufacturer.VehicleTypes.map((e) => {
                  return e.Name;
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedManufacturer && (
        <div className="popup">
          <div className="selected">
            <button onClick={() => setSelectedManufacturer(null)}>X</button>
            <h2>{selectedManufacturer[0].Mfr_Name}</h2>
            <p>
              {selectedManufacturer[0].PrincipalFirstName} (
              {selectedManufacturer[0].PrincipalPosition})
            </p>
            <p>Address: {selectedManufacturer[0].Address}</p>
            <p>State: {selectedManufacturer[0].StateProvince}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
