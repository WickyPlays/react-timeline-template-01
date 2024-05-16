import ReportIcon from '@mui/icons-material/Report';
import HelpIcon from '@mui/icons-material/Help';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LINK_REGEX, stringHasLink } from './utils/Utils';
import { TIMELINES } from './Timelines';

const TAGS = ['[TITLE]', '[DESCRIPTION]', '[CONTEXT]', '[REFERENCES]', '[PRIORITY]'];

export const PRIORITY = {
  KEY: {
    title: 'Key event',
    backgroundColor: '#DA0000',
    icon: <ReportIcon />
  },
  HIGHEST: {
    title: 'Highest priority',
    backgroundColor: '#FF0000',
    icon: <PriorityHighIcon />
  },
  HIGH: {
    title: 'High priority',
    backgroundColor: '#FF4500',
    icon: <WarningIcon />
  },
  MEDIUM: {
    title: 'Medium priority',
    backgroundColor: '#FFA500',
    icon: <InfoIcon />
  },
  LATER: {
    title: 'Later priority',
    backgroundColor: '#FFD700',
    icon: <ScheduleIcon />
  },
  OPTIONAL: {
    title: 'Optional',
    backgroundColor: '#008000',
    icon: <LowPriorityIcon />
  },
  COMPLETED: {
    title: 'Completed',
    backgroundColor: '#00FF00',
    icon: <CheckCircleIcon />
  },
  UNKNOWN: {
    title: 'Unknown',
    backgroundColor: '#454545',
    icon: <HelpIcon />
  }
}

export function parseAllTimelines() {
  const parsedTimelines = [];

  for (const year in TIMELINES) {
    for (const month in TIMELINES[year]) {
      for (const day in TIMELINES[year][month]) {

        const dayTimelines = {
          time: `${year}/${month}/${day}`,
          events: []
        }

        TIMELINES[year][month][day].forEach(event => {
          const eventData = event.split("\n").map(line => line.trim());
          const parsedEvent = {
            time: `${year}/${month}/${day}`,
            title: "",
            description: "",
            context: { content: "", references: [] },
            priority: PRIORITY.UNKNOWN
          };

          for (let i = 0; i < eventData.length; i++) {
            switch (eventData[i]) {
              case "[TITLE]":
                parsedEvent.title = eventData[i + 1];
                i++;
                break;
              case "[DESCRIPTION]":
                parsedEvent.description = eventData[i + 1];
                i++;
                break;
              case "[CONTEXT]": {
                let finalData = "";
                for (let j = i + 1; j < eventData.length; j++) {
                  if (TAGS.includes(eventData[j])) {
                    i = j - 1;
                    break;
                  }
                  finalData += eventData[j].length === 0
                    ? "<br />"
                    : `<p>${eventData[j].replace(LINK_REGEX, match => `<a href="${match}">${match}</a>`)}</p>`;
                }
                parsedEvent.context.content = finalData;
                break;
              }
              case "[REFERENCES]": {
                for (let j = i + 1; j < eventData.length; j++) {
                  if (TAGS.includes(eventData[j])) {
                    i = j - 1;
                    break;
                  }
                  const match = eventData[j].match(/\[(.*?)\]\((.*?)\)/);
                  parsedEvent.context.references.push(match
                    ? { title: match[1], url: match[2] }
                    : { title: eventData[j], url: eventData[j] });
                }
                break;
              }
              case "[PRIORITY]":
                parsedEvent.priority = PRIORITY[eventData[i + 1].toUpperCase()];
                i++;
                break;
            }
          }

          dayTimelines.events.push(parsedEvent);
        });

        parsedTimelines.push(dayTimelines);
      }
    }
  }

  return parsedTimelines;
}
