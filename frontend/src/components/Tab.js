import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Row } from 'react-bootstrap';
import Comment from './Comment';
import Requests from './Requests';
import ProfileComponents from '../components/ProfileComponents';


export default function LabTabs({ id, showBookmark = false, showRequests = false }) {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%', typography: 'body1'  }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="white" centered>
            <Tab label="ALBUM" value="1" />
            <Tab label="Likes" value="2" />
            {showBookmark && <Tab label="BookMarks" value="3" />}
            <Tab label="Comments" value="4" />

            {showRequests && <Tab label="Follow Requests" value="5" /> }
          </TabList>
        </Box>
        <TabPanel value="1">
          <ProfileComponents showAlbum={true} id={id}/>

        </TabPanel>
        <TabPanel value="2">
        
        <ProfileComponents showLike={true} id={id}/>
        </TabPanel>
        {showBookmark && (
          <TabPanel value="3">
            <Row className='justify-content-center'>
              <ProfileComponents showBookmark={true} id={id}/>
            </Row>
          </TabPanel>
        )}
        <TabPanel value="4"><Comment id={id} showDelete={showBookmark}/></TabPanel>
        {showRequests && 
                <TabPanel value="5">
                  <Requests/>

                </TabPanel>


        }
      </TabContext>
    </Box>
  );
}
