import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
//import axios from "axios";
import fetchJsonp from "fetch-jsonp";

const API_URL = "https://preview-hosted.mastersoftgroup.com/harmony/rest/au/address?callback=jsonCallback&sourceOfTruth=GNAF&transactionID=a53d240365e6b75d65f5bf70d951289f&Authorization=Basic%20YWx1c2VyOlBselhpV3hxVUd4R094NXIycFNjamUyUWllYUV4YlY4&state=";

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem
  } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.title) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.objectID}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.title}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.oneOfType([
    PropTypes.oneOf([null]),
    PropTypes.number
  ]).isRequired,
  index: PropTypes.number.isRequired,
  itemProps: PropTypes.object.isRequired,
  selectedItem: PropTypes.string.isRequired,
  suggestion: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: "wrap"
  },
  inputInput: {
    width: "auto",
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  }
}));

export default function MyAutoComplete() {
  const classes = useStyles();

  const emptyList = [];
  const [data, setData] = useState(emptyList);
  //const [query, setQuery] = useState("redux");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getSuggestions = (value, { showEmpty = false } = {}) => {
    return data;
  };

  const handleInputChange = event => {
    const query = event.target.value;
    console.log("query=", event.target.value);
    if (query.length >= 3) {
      setUrl(`${API_URL}&fullAddress=${query}`);
    } else {
      setData(emptyList);
    }
  };

  const renderInput = inputProps => {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput
          },
          ...InputProps
        }}
        onChange={handleInputChange}
        {...other}
      />
    );
  };

  useEffect(() => {
    console.log("url=",url);
    if (url === "") { return; }
    fetchJsonp(url, {
      jsonpCallbackFunction: 'jsonCallback',
    })
      .then((response) => {
        return response.json()
      }).then((json) => {
        setData({
          results: json.payload
        })
        console.log('parsed json', json)
      }).catch((ex) => {
        console.log('parsing failed', ex)
      })
  }, [url]);

/*
  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(url);
        //console.log("result=", result.data);
        setData(result.data);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [url]);
*/

  return (
    <div className={classes.root}>
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: "Type in address here"
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                label: "",
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onFocus },
                inputProps
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.title }),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}
