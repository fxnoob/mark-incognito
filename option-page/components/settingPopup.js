import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Db from "../../src/lib/db";

const db = new Db();
const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default class CustomizedDialogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteUrlHistory: false
    };
  }
  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { factory_setting } = await db.get("factory_setting");
    this.setState({ ...factory_setting });
  };

  toggle = key => async target => {
    const flipVal = !this.state[key];
    await this.setState({ [key]: flipVal });
    console.log({ flipVal, val: this.state[key], state: this.state });
    db.set({ factory_setting: this.state });
  };
  handleClose = () => {
    this.props.onClose();
  };
  render() {
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.props.open}
      >
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          Settings
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.deleteUrlHistory || false}
                  onChange={this.toggle("deleteUrlHistory")}
                />
              }
              label="Delete hidden url from history"
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
