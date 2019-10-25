import React from 'react';
import Db from "../../src/lib/db";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.db = new Db();
    this.state = {
      urlList: []
    }
  }

  fetchAllUrls = async () => {
    let data = await this.db.get(null);
    this.setState({
      urlList: Object.keys(data)
    });
  }

  deleteUrlEntry = async (url) => {
    let res = await this.db.remove(url);
    this.fetchAllUrls();
  }

  componentDidMount() {
    this.fetchAllUrls();
  }

  render() {
    return (
      <div>
        <h3>Mark Incognito Options Page</h3>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Url</th>
              <th>Active</th>
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
      </div>
    );
  }
}