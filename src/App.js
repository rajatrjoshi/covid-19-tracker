import React, {useState, useEffect} from "react";
import {MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrintStat} from './util.js';
import LineGraph from './LineGraph.js';
import "leaflet/dist/leaflet.css";


// https://disease.sh/v3/covid-19/countries
//USEEFFECT = Runs a peice of code based on a given condition
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState();
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    // async -> send a request, wait for it, do something with the info
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) =>
        ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        const sortedData = sortData(data)
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData);
      })
    };
    getCountriesData();
  }, []);


  const onCountryChange = async(event) => {
    const countryCode= event.target.value;
    setCountry(countryCode);


    const url= countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      //All of the data from the country response
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
  };



  
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className= "app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                  <MenuItem value= {country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
          isRed
          active={casesType === "cases"}
          onClick = {(e => setCasesType("cases"))}
          title="Covid19 Cases" 
          cases={prettyPrintStat(countryInfo.todayCases)} 
          total={prettyPrintStat(countryInfo.cases)}/> 

          <InfoBox 
          active={casesType === "recovered"}
          onClick = {(e => setCasesType("recovered"))}
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          total={prettyPrintStat(countryInfo.recovered)}/> 

          <InfoBox 
          isRed
          active={casesType === "deaths"}
          onClick = {(e => setCasesType("deaths"))}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}/>
        </div>

        <Map
        casesType = {casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom = {mapZoom}
        />
      <div className="app__copyright">
        <h4> © 2021 THETECHTHING, Inc.</h4>
      </div>
    </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>   
            <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType= {casesType}/>
        </CardContent>
      </Card>
    </div>
      
  );
}

export default App;
