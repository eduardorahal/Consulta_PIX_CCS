'use client'

import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import BuildIcon from '@mui/icons-material/Build';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

export const mainListItems = () => {

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  }

  return (
    <div>
      <ListItem button component={Link} href="/" 
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Visão Geral" />
      </ListItem>
      <ListItem button component={Link} href="/pix"
        selected={selectedIndex === 1}
        onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="PIX" />
      </ListItem>
      <ListItem button component={Link} href="/ccs"
      selected={selectedIndex === 2}
      onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="CCS" />
      </ListItem>
    </div >
  )
};

export const secondaryListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Sair" />
    </ListItem>
  </div>
);
