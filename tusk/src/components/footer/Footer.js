import Grid from "@mui/material/Grid";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <Grid container spacing={2}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <span>A Yocket Assignment</span>
        </Grid>
        <Grid item xs={3}>
          <span>Developed by Sandeep Mitra</span>
        </Grid>
      </Grid>
    </div>
  );
}
