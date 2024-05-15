import React from 'react';

import './TimelinePage.scss'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { parseAllTimelines } from '../../Constants';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogContent, Slide } from '@mui/material';
import { formatDate } from '../../utils/Utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContextDialog = ({ context, setContext }) => {

  const handleClose = () => {
    setContext(null)
  }

  return (
    <Dialog
      className='timeline-context-dialog'
      open={context !== undefined && context !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide"
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: 20
        }
      }}
    >
      <DialogContent className='content'>
        {
          context && (
            <div className='content-container'>
              <div className='title-container'>
                <div></div>
                <p className='title'>{context.title}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CloseIcon onClick={handleClose} className='btn-close' />
                </div>
              </div>
              <div className='content-body'>
                <div className='content-text' dangerouslySetInnerHTML={{ __html: context.context.content }}></div>
                <div className='content-end'>
                  <p>- End of content -</p>
                </div>
              </div>
            </div>
          )
        }
      </DialogContent>
    </Dialog>
  )
}

export default function TimelinePage() {

  const [context, setContext] = React.useState(null);

  return (
    <div className="timeline-page">
      <Timeline className='timeline' position="right">
        {
          parseAllTimelines().map((timeline) => {
            return (
              <div className='timeline-event-item'>
                <p className='date'>{formatDate(timeline.time)}<span className='date-mini'>{`(${timeline.time})`}</span></p>
                {
                  timeline.events.map((event, index) => {
                    return (
                      <TimelineItem
                        className='timeline-item'
                        key={index}
                      >
                        <TimelineSeparator>
                          {
                            index > 0 && (
                              <TimelineConnector className='timeline-connector-restrict' />
                            )
                          }
                          <TimelineDot sx={{ bgcolor: event.priority.backgroundColor }}>
                            {event.priority.icon}
                          </TimelineDot>
                          {
                            index < timeline.events.length - 1 && (
                              <TimelineConnector />
                            )
                          }
                        </TimelineSeparator>
                        <TimelineContent
                          className={`timeline-item-content`}
                          style={(index > 0) ? { paddingTop: 55 } : undefined}>
                          <div>
                            <p className='title'>
                              <span className='priority' style={{ backgroundColor: event.priority.backgroundColor }}>
                                {event.priority.title}
                              </span>
                              <span>{event.title}</span>
                              {
                                event.context.content && (
                                  <PriorityHighIcon className='btn-info' onClick={() => setContext(event)} />
                                )
                              }
                            </p>
                            <div className='content-body'>
                              <div className='description'>{event.description}</div>
                              {
                                event.context.references.length > 0 && (
                                  <div className='reference-container'>
                                  <p className='label'>References:</p>
                                  {
                                    event.context.references.map((reference, index) => {
                                      return (
                                        <div>
                                          <a className='reference' key={index} href={reference.url} target='_blank' rel='noreferrer'>
                                            {reference.title}
                                          </a>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                                )
                              }
                            </div>
                          </div>
                        </TimelineContent>
                      </TimelineItem>
                    )
                  })
                }
              </div>
            )
          })
        }

      </Timeline>
      <ContextDialog context={context} setContext={setContext} />
    </div>
  )
}