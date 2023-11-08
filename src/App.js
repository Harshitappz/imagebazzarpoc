import React, { useState, useRef, useEffect } from 'react';
import { getVisibleKeywordListingNoRedux } from './services/keywordsApis';
export const getArrayOfObjJoinToStringForKey = (arr, key, joinKey = ", ") => {
  return arr?.map((u) => u[key])?.join(joinKey) || ""
}

export const findObjectIndexInArray = (arr, keyName, keyValue) => { return arr?.findIndex(p => p[keyName]?.toLowerCase() === keyValue?.toLowerCase()) };


function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const [actualKeywords, setActualKeywords] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [blobURL, setBlobURL] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create a Blob URL from the selected file
    const fileBlobURL = URL.createObjectURL(file);
    setBlobURL(fileBlobURL);
  };

  const handleClick = (e, index) => {

    if(e.detail % 2 != 0  ){
      let selectedList = document.getElementsByClassName('selected-list')
      if(selectedList?.length){
        for (var i = 0; i < selectedList?.length; i++) {
          selectedList[i].classList.remove("focused-li")
        }
      }
      if (e.target.tagName === 'LI') {
        e.target.classList.add("focused-li")
      }else if (e.target.tagName === 'DIV'){
        // Add the class to the clicked <li> element's parent
        e.target.parentNode.classList.add("focused-li");
      }else if(e.target.tagName === 'BUTTON'){
        e.target.parentNode.classList.add("focused-li");
      }
    }

    else if(e.detail % 2 == 0){
      handleRemove(index, index == 0 ? 'ul_li_child' + index : index == selectedResults?.length -1 ?'ul_li_child' + (index -1) : 'ul_li_child' + (index + 1))
    }

    // switch (e.detail) {
    //   case 1:
    //     let selectedList = document.getElementsByClassName('selected-list')
    //     if(selectedList?.length){
    //       for (var i = 0; i < selectedList?.length; i++) {
    //         selectedList[i].classList.remove("focused-li")
    //       }
    //     }
    //     if (e.target.tagName === 'LI') {
    //       e.target.classList.add("focused-li")
    //     }else if (e.target.tagName === 'DIV'){
    //       // Add the class to the clicked <li> element's parent
    //       e.target.parentNode.classList.add("focused-li");
    //     }else if(e.target.tagName === 'BUTTON'){
    //       e.target.parentNode.classList.add("focused-li");
    //     }
    //     break;
    //   case 2:
    //     handleRemove(index,  index == 0 ? 'ul_li_child' + index : index == selectedResults?.length -1 ?'ul_li_child' + (index -1) : 'ul_li_child' + (index + 1))
    //     break;
    //   default: 
    //     handleRemove(index,  index == 0 ? 'ul_li_child' + index : index == selectedResults?.length -1 ?'ul_li_child' + (index -1) : 'ul_li_child' + (index + 1))
    //     break;
    // }
  };


  useEffect(() => {
    const handleKeydown = (e) => {
      if (!(document.activeElement.id === 'search-results')) {
        if (e.key === 'Tab' && document.activeElement.id === 'search-input') {
          // Hide the results popup or perform other actions if needed
          // e.preventDefault()
          setSelectedIndex(0)
  
        }else if (e.key === 'Enter') {
          if(document.activeElement.id === 'search-input'){
            handleResultSelection(selectedIndex);
            if(inputRef){
              inputRef?.current?.focus()
              setTimeout(function () {
                inputRef?.current?.select() 
              }, 10);
            }
          }
        }
        return; // Exit early if the active element is not within the select-results
      }
      if (e.key === 'ArrowUp' && selectedIndex > 0) {
        const container = document.getElementById('tablebody-search-container');
        const element = document.getElementById(results[selectedIndex - 1]?.vid + results[selectedIndex - 1]?.visible_keyword + (selectedIndex - 1));
        // element.scrollIntoView(false);
        // Check if the element is at the top of the container
        if ((selectedIndex * element.clientHeight) - element.clientHeight <= container.scrollTop) {
          container.scrollTop -= element.clientHeight;
        }
        setSelectedIndex(selectedIndex - 1);
        scrollContainerToSelected();
      } else if ((e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowLeft') && selectedIndex < results.length - 1) {
        const element = document.getElementById(results[selectedIndex + 1]?.vid + results[selectedIndex + 1]?.visible_keyword + (selectedIndex + 1));
        // element.scrollIntoView(false);
        const container = document.getElementById('tablebody-search-container');
        if (
          (selectedIndex * element.clientHeight) + element.clientHeight >=
          container.scrollTop + container.clientHeight
        ) {
          container.scrollTop += element.clientHeight;
        }
      
        setSelectedIndex(selectedIndex + 1);
        scrollContainerToSelected();
      }  else if (e.key === 'Enter' && selectedIndex !== null) {
        handleResultSelection(selectedIndex);
        if(inputRef){
          inputRef?.current?.focus()
          setTimeout(function () {
            inputRef?.current?.select() 
          }, 10);
        }
      } else if (e.key === 'Tab') {
        // Hide the results popup or perform other actions if needed
        // e.preventDefault()
        // setSelectedIndex(0)
        setSelectedIndex(null)
      } else if (e.key === 'Escape') {
        setResults([])
        setSelectedIndex(null)
        // Hide the results popup or perform other actions if needed
      } 
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [results, selectedIndex, selectedResults]);

  async function searchMockData(e) {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      let data = await getVisibleKeywordListingNoRedux({
        search: value,
        page: "1",
        limit: "20",
      });
      setResults(data);
    
    } else {
      setResults([]);
      setSelectedIndex(null)
    }
  }

  const handleResultSelection = (selectedResult) => {
    try{
      // console.log(selectedResult)
      // Check if the selectedResult with the same 'vid' doesn't exist in the selectedResults array
      if ((!selectedResults?.includes(results[selectedResult]?.visible_keyword)) && selectedResult != null && selectedResult != undefined && results[selectedResult] && query) {
        setSelectedResults((prevSelectedResults) => [...prevSelectedResults, results[selectedResult]?.visible_keyword]);
        setQuery(results[selectedResult]?.visible_keyword);
      }else{
        let queryIndex = findObjectIndexInArray(results, 'visible_keyword', query)
        if ((!selectedResults?.includes(results[queryIndex]?.visible_keyword)) && queryIndex > -1 ) {
          setSelectedResults((prevSelectedResults) => [...prevSelectedResults, results[queryIndex]?.visible_keyword]);
          setQuery(results[queryIndex]?.visible_keyword);
        }
        // if ((!selectedResults?.some((item) =>  item?.visible_keyword === query)) && query?.trim()?.length && query?.trim()) {
        //   setSelectedResults((prevSelectedResults) => [...prevSelectedResults, {
        //     deleted_row: 0,
        //     hiddenkeywords: [],
        //     status: 1,
        //     vid: query,
        //     visible_keyword : query
        //   }]);
        // }else{
        //   if(!query?.trim()?.length){
        //     setQuery("");
        //   }else{
        //     setQuery(results[selectedResult]?.visible_keyword);
        //   }
        // }
      }
      setResults([])
      setSelectedIndex(null)
      // setQuery(results[selectedResult]?.visible_keyword);
    }
    catch(e){}
  };

  const scrollContainerToSelected = () => {
    if (resultsContainerRef?.current && selectedIndex !== null) {
      const selectedRow = resultsContainerRef?.current?.children[selectedIndex];
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleRemove = (index, id)=>{
    let copyArr = [...selectedResults]
    copyArr.splice(index, 1)
    setSelectedResults(copyArr)
    if(id && selectedResults?.length){
      let ele = document.getElementById(id)
      if(ele){
        ele?.focus();
      }
    }
  }

  // const handleRemove = (index, id) => {
  //   if (index !== null && index >= 0 && index < selectedResults.length) {
  //     const copyArr = [...selectedResults];
  //     copyArr.splice(index, 1);
  //     setSelectedResults(copyArr);

  //     // Focus on the next item if it exists
  //     if (id && selectedResults?.length) {
  //       // Delay the focus slightly to avoid issues with double-click
  //       setTimeout(() => {
  //         const nextElement = document.getElementById(id)
  //         if (nextElement) {
  //           nextElement.focus();
  //         }
  //       }, 10);
  //     }
  //   }
  // };


  return (
    <div className="App">
      <div className="container">
        <div className="container-child-wrapper row">
          <div className="col-8 d-flex flex-column">
            <div>
              <div className="row">
                <div className="col-9">
                  <div className="d-flex mb-3">
                    <label
                      htmlFor="inputEmail3"
                      className="col-form-label me-2 size-12"
                      style={{ lineHeight: 1 }}
                    >
                      Select Classification
                    </label>
                    <div className="" style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="form-control rounded-0 size-12"
                        id="inputEmail3"
                        style={{ lineHeight: 1 }}
                      />
                    </div>
                  </div>
                  <div className="d-flex mb-3 position-relative">
                    <label
                      htmlFor="inputPassword3"
                      className="col-form-label me-2 size-12"
                      style={{ lineHeight: 1 }}
                    >
                      Search Keyword
                    </label>
                    <div className="" style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="form-control rounded-0 size-12"
                        value={query}
                        id="search-input"
                        placeholder="Search (min 3 letters)"
                        onChange={(e) => searchMockData(e)}
                        ref={inputRef}
                        style={{ lineHeight: 1 }}
                      />
                    </div>
                    {!!results?.length && (
                      <div
                        id="search-results"
                        className="p-0"
                        ref={resultsContainerRef}
                        tabIndex={0}
                      >
                        <table className="fixed_headers">
                          <thead>
                            <tr>
                              <th>Sr.</th>
                              <th>Actual Keywords</th>
                              <th>Keywords</th>
                              <th>Hidden Keywords</th>
                            </tr>
                          </thead>
                          <tbody id="tablebody-search-container">
                            {results?.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  id={item?.vid + item?.visible_keyword + index}
                                  // onKeyDown={(e) => handleKeyDown(e, item, index)}
                                  onClick={(e) => {
                                    handleResultSelection(index)
                                    if(inputRef){
                                      inputRef?.current?.focus()
                                      setTimeout(function () {
                                        inputRef?.current?.select() 
                                      }, 10);
                                    }
                                  }}
                                  style={{
                                    background:
                                      selectedIndex === index
                                        ? "#b6b6b6a1"
                                        : "none",
                                  }}
                                >
                                  <td>{index + 1}</td>
                                  <td>{item?.visible_keyword}</td>
                                  <td>{item?.visible_keyword}</td>
                                  <td>
                                    {getArrayOfObjJoinToStringForKey(
                                      item?.hiddenkeywords,
                                      "all_keyword",
                                      ", "
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                        <div
                          className="text-end p-2"
                          style={{ background: "#31959e54" }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary me-2"
                            onClick={() => {}}
                          >
                            Insert in Not Found
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setResults([])
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-3">
                  <button
                    type="submit"
                    className="btn btn-sm btn-secondary mb-2"
                    onClick={() => {
                      setActualKeywords(selectedResults)
                    }}
                  >
                    Submit
                  </button>
                  <br />
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary mt-1"
                    onClick={() => {
                      handleResultSelection(selectedIndex)
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="row g-2 h-100" style={{ flex: 1 }}>
              <div className="col-4 parent-keyword max-height-for-list-scroll">
                <ul className="no-bullets container-with-scroll container-child-full-height p-2"></ul>
              </div>
              <div className="col-4 child-keyword max-height-for-list-scroll">
                <ul className="no-bullets container-with-scroll container-child-full-height p-2"></ul>
              </div>
              <div className="col-4 selected-keyword max-height-for-list-scroll">
                <ul className="no-bullets container-with-scroll container-child-full-height p-1">
                  {selectedResults?.map((el, index) => {
                    return (
                      <li
                        key={el}
                        id={"ul_li_child" + index}
                        className="p-1 size-12 selected-list"
                        style={{ cursor: "default", display: "flex" }}
                        onClick={(e) => {
                          handleClick(e, index)
                        }}
                        // onDoubleClick={()=>{handleRemove(index,  index == 0 ? 'ul_li_child' + index : index == selectedResults?.length -1 ?'ul_li_child' + (index -1) : 'ul_li_child' + (index + 1))}}
                        onMouseDown={function (e) {
                          e.preventDefault()
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            wordBreak: "break-word",
                            paddingRight: 10,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {el}
                        </div>
                        {/* <div>
                          <button
                            style={{ cursor: "pointer", padding: "0 4px",
                            fontSize: "10px", fontWeight: "bold" }}
                            className='btn btn-sm btn-danger'
                            onClick={() => {
                              handleRemove(
                                index,
                                index == 0
                                  ? "ul_li_child" + index
                                  : index == selectedResults?.length - 1
                                  ? "ul_li_child" + (index - 1)
                                  : "ul_li_child" + (index + 1)
                              )
                            }}
                          >
                            Delete
                          </button>
                        </div> */}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <div className="text-end mt-2">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setResults([])
                  setSelectedIndex(null)
                  setSelectedResults([])
                  setActualKeywords([])
                  setQuery("")
                }}
              >
                Save
              </button>
            </div>
          </div>
          <div className="col-4">
            <div style={{ height: 200 }}>
              <h6>Selected Actual Words</h6>
              <div
                className="p-2 size-12 container-with-scroll"
                style={{ maxHeight: 190, border: "1px solid black" }}
              >
                {/* {getArrayOfObjJoinToStringForKey(
                  actualKeywords,
                  "visible_keyword",
                  ", "
                )} */}
                {actualKeywords?.length ? actualKeywords?.join(", ") : '' }
              </div>
            </div>
            <div style={{ marginTop: 35 }}>
              <input
                class="form-control form-control-sm"
                id="formFileSm"
                type="file"
                ref={fileInputRef}
                accept="images*" // Specify the allowed file types
                onChange={handleFileChange}
              />
            </div>
            <div
              className="mt-3"
              style={{
                background: "aliceblue",
                height: "100%",
                maxHeight: 280,
                overflow: "hidden",
              }}
            >
              {selectedFile && (
                <div>
                  {/* <p>Selected File: {selectedFile.name}</p>
                  <a href={blobURL} download={selectedFile.name}>
                    Download File
                  </a> */}
                  <img
                    src={blobURL}
                    alt={selectedFile?.name || "Preview"}
                    className="img-fluid"
                    style={{
                      objectFit: "contain",
                      objectPosition: "center center",
                      maxHeight: "280px",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;