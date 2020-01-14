import React from "react";
import TopBar from "./topBar";
import SettingPopup from "./settingPopup";
import "./home.css";
import Db, { Schema } from "../../src/lib/db";

const schema = new Schema();
const db = new Db();

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSettings: false,
      urlList: []
    };
  }

  getMarkedUrlsList = data => {
    const excludedKeys = [...Object.keys(schema.data), "loadedFirstTime"];
    return Object.keys(data).filter(key => excludedKeys.indexOf(key) === -1);
  };

  fetchAllUrls = async () => {
    let data = await db.getAll();
    this.setState({
      urlList: this.getMarkedUrlsList(data)
    });
  };

  deleteUrlEntry = async url => {
    let res = await db.remove(url);
    this.fetchAllUrls();
  };

  toggleSettingsVisibility = () => {
    this.setState({ showSettings: true });
  };

  componentDidMount() {
    this.fetchAllUrls();
  }
  handleClose = () => {
    this.setState({ showSettings: false });
  };
  render() {
    return (
      <div>
        <TopBar toggleSettingsVisibility={this.toggleSettingsVisibility} />
        <SettingPopup
          open={this.state.showSettings}
          onClose={this.handleClose}
        />
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Url [marked for Incognito]</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.urlList.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <a href={item}>{item}</a>
                  </td>
                  <td
                    className="delete-button"
                    onClick={() => this.deleteUrlEntry(item)}
                  >
                    Delete
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ textAlign: "center" }}>
          Made with{" "}
          <span
            style={{
              color: "#e25555",
              content: "\\2661",
              textDecoration: "underline"
            }}
          >
            Love
          </span>
        </p>
      </div>
    );
  }
}
