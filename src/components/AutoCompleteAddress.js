import React from "react";
import axios from "axios";
import fetchJsonp from "fetch-jsonp";

import AutoCompleteSuggestions from "./AutoCompleteSuggestions";

const API_URL = "https://preview-hosted.mastersoftgroup.com/harmony/rest/au/address?callback=jsonCallback&sourceOfTruth=GNAF&transactionID=a53d240365e6b75d65f5bf70d951289f&Authorization=Basic%20YWx1c2VyOlBselhpV3hxVUd4R094NXIycFNjamUyUWllYUV4YlY4&state=";

export class AutoCompleteAddress extends React.Component {

  state = {
    query: '',
    results: []
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      }
    })
  }

  getInfo = () => {
    fetchJsonp(`${API_URL}&fullAddress=${this.state.query}`, {
      jsonpCallbackFunction: 'jsonCallback',
    })
      .then((response) => {
        return response.json()
      }).then((json) => {
        this.setState({
          results: json.payload
        })
        console.log('parsed json', json)
      }).catch((ex) => {
        console.log('parsing failed', ex)
      })
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <form>
      
        <input
          id="rapidAddress" 
          size="100"
          placeholder="Type in address here"
          ref={input => this.search = input}
          onChange={this.handleInputChange}
        />
        <AutoCompleteSuggestions results={this.state.results} />
      </form>
    );
  }
}