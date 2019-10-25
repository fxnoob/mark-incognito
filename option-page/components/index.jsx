import React from 'react';
import Db from "../../src/lib/db";


const db = new Db();

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlList: []
    }
  }

  fetchAllUrls = async () => {
    let data = await db.getAll();
    this.setState({
      urlList: Object.keys(data)
    });
  }

  deleteUrlEntry = async (url) => {
    let res = await db.remove(url);
    this.fetchAllUrls();
  }

  componentDidMount() {
    this.fetchAllUrls();
  }

  render() {
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>Mark Incognito </h3>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Url [marked for Incognito]</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {
            this.state.urlList.map((item, idx) => {
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item}</td>
                  <td className="delete-button" onClick={() => this.deleteUrlEntry(item)}>Delete</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        <p style={{textAlign: 'center'}}>
          Made with <span style={{color: '#e25555'}}>&#9829;</span>
        </p>
      </div>
    );
  }
}
