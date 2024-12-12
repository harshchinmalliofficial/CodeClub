import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

const App = () => {
  const baseUrl = import.meta.env.VITE_USER_SERVER_BASE_URL;
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUserdetails] = useState("");
  const [questions, setQuestion] = useState([]);
  const token = localStorage.getItem("authToken");
  // console.log(token);

  useEffect(() => {
    if (token) {
      axios
        .get(`${baseUrl}/auth`, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((response) => {
          setUserdetails(response.data.user);
        });
    }
    GetQuestions();
  }, [token, baseUrl]);

  const GetQuestions = () => {
    axios
      .get(`${baseUrl}/GetQuestions`)
      .then((res) => {
        setQuestion(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // quest();

  // Handle no token caseconst
  if (!token) {
    return (
      <>
        <center>
          <h1 style={{ color: "brown" }}>
            Alert! Secured Route, Login/Signup to access
          </h1>
          <br></br>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "brown",
              fontWeight: "bold",
              marginTop: "10px",
              paddingTop: "10px",
            }}
          >
            Click To Login
          </Link>
        </center>
      </>
    );
  }

  const codeString = `void solve(){
    cout << "Solution will be available at 11PM tonight" << endl;
  }`;
  const menuItems = [
    {
      id: 1,
      label: "A. Polycarv and the Day of Pi",
      link: "https://codeforces.com/",
      solution: `void solve(){
      ll n,c,d;
      cin >> n >> c >>d;
      ll arr[n*n];
      map<ll,ll> mpp;
      f(i,0,n*n){
        cin >> arr[i];
        mpp[arr[i]]++;
      }
      sort(arr,arr+n*n);
      ll x = arr[0];
      f(j,0,n){
        if(mpp.find(x) == mpp.end()){
          no;
          return;
        }else{
          mpp[x]--;
          if(mpp[x] == 0){
            mpp.erase(x);
          }
        }
        f(i,1,n){
          if(mpp.find(x+(i*c)) != mpp.end()){
            mpp[x+(i*c)]--;
            if(mpp[x+(i*c)] == 0){
              mpp.erase(x+(i*c));
            }
          }else{
            // deb;
            no;
            return;
          }
        }
        x=x+d;
        // cout << x << endl;
      }
     
      yes;
    }`,
      time: 1713807000000,
    },
    {
      id: 2,
      label: "B. binary search STL",
      link: "#",
      solution: `void solve(){
      ll n,c,d;
      cin >> n >> c >>d;
      ll arr[n*n];
      map<ll,ll> mpp;
      f(i,0,n*n){
        cin >> arr[i];
        mpp[arr[i]]++;
      }
      sort(arr,arr+n*n);
      ll x = arr[0];
      f(j,0,n){
        if(mpp.find(x) == mpp.end()){
          no;
          return;
        }else{
          mpp[x]--;
          if(mpp[x] == 0){
            mpp.erase(x);
          }
        }
        f(i,1,n){
          if(mpp.find(x+(i*c)) != mpp.end()){
            mpp[x+(i*c)]--;
            if(mpp[x+(i*c)] == 0){
              mpp.erase(x+(i*c));
            }
          }else{
            // deb;
            no;
            return;
          }
        }
        x=x+d;
        // cout << x << endl;
      }
     
      yes;
    }`,
      time: 1713654000000,
    },
    {
      id: 3,
      label: "D. Three-level Laser",
      link: "#",
      solution: `void solve(){
      ll n,c,d;
      cin >> n >> c >>d;
      ll arr[n*n];
      map<ll,ll> mpp;
      f(i,0,n*n){
        cin >> arr[i];
        mpp[arr[i]]++;
      }
      sort(arr,arr+n*n);
      ll x = arr[0];
      f(j,0,n){
        if(mpp.find(x) == mpp.end()){
          no;
          return;
        }else{
          mpp[x]--;
          if(mpp[x] == 0){
            mpp.erase(x);
          }
        }
        f(i,1,n){
          if(mpp.find(x+(i*c)) != mpp.end()){
            mpp[x+(i*c)]--;
            if(mpp[x+(i*c)] == 0){
              mpp.erase(x+(i*c));
            }
          }else{
            // deb;
            no;
            return;
          }
        }
        x=x+d;
        // cout << x << endl;
      }
     
      yes;
    }`,
      time: 1713205800000,
    },
    {
      id: 4,
      label: "E. Number of Smaller",
      link: "#",
      solution: `void solve(){
      ll n,c,d;
      cin >> n >> c >>d;
      ll arr[n*n];
      map<ll,ll> mpp;
      f(i,0,n*n){
        cin >> arr[i];
        mpp[arr[i]]++;
      }
      sort(arr,arr+n*n);
      ll x = arr[0];
      f(j,0,n){
        if(mpp.find(x) == mpp.end()){
          no;
          return;
        }else{
          mpp[x]--;
          if(mpp[x] == 0){
            mpp.erase(x);
          }
        }
        f(i,1,n){
          if(mpp.find(x+(i*c)) != mpp.end()){
            mpp[x+(i*c)]--;
            if(mpp[x+(i*c)] == 0){
              mpp.erase(x+(i*c));
            }
          }else{
            // deb;
            no;
            return;
          }
        }
        x=x+d;
        // cout << x << endl;
      }
     
      yes;
    }`,
      time: 1713119400000,
    },
  ];

  const handleMenuItemClick = (id) => {
    setSelectedItem(id);
  };
  return (
    <div className="container">
      <div className="left-menu">
        <div className="menu-items-container">
          <ul className="menu-items">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={
                  selectedItem?.id === item.id
                    ? "menu-item-active menu-item"
                    : "menu-item"
                }
                onClick={() => handleMenuItemClick(item)}
              >
                <span className={index === 0 ? "today" : "hidden"}>
                  Today`s Problem
                </span>
                <span className="menu-item-text">{item.label}</span>
                <span className="menu-item-icon">
                  <i className="fas fa-chevron-right"></i>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="right-content">
        {selectedItem ? (
          <div className="inside-container-right">
            <div className="selected-item-container">{selectedItem.label}</div>
            <SyntaxHighlighter
              className="solution"
              language="cpp"
              style={coy}
              showLineNumbers
              showInlineLineNumbers
            >
              {selectedItem.time < new Date().getTime()
                ? selectedItem.solution
                : codeString}
            </SyntaxHighlighter>

            <div className="button-right-container">
              {selectedItem.time > new Date().getTime() ? (
                <Link to={selectedItem.link} className="button-right first">
                  Get Coins
                </Link>
              ) : (
                <></>
              )}
              <Link to={selectedItem.link} className="button-right first">
                Solve
              </Link>
            </div>
          </div>
        ) : (
          <div className="selected-item-container">
            Select a Question to continue!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
