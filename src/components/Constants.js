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
            context: {
              content: "",
              references: []
            },
            priority: PRIORITY.UNKNOWN
          };

          for (let i = 0; i < eventData.length; i++) {
            if (eventData[i] === "[TITLE]") {
              parsedEvent.title = eventData[i + 1];
            } else if (eventData[i] === "[DESCRIPTION]") {
              parsedEvent.description = eventData[i + 1];
            } else if (eventData[i] === "[CONTEXT]") {
              let contextData = eventData.slice(i + 1)
              let finalData = ""

              for (let j = 0; j < contextData.length; j++) {
                if (contextData[j] === "[REFERENCES]") {
                  break;
                }

                if (contextData[j].length == 0) {
                  finalData += "<br />"
                } else {
                  if (stringHasLink(contextData[j])) {
                    const replacedText = contextData[j].replace(LINK_REGEX, (match) => {
                      return `<a href="${match}">${match}</a>`;
                    });
                    finalData += `<p>${replacedText}</p>`;
                  } else {
                    finalData += `<p>${contextData[j]}</p>`
                  }

                }
              }

              parsedEvent.context.content = finalData
              console.log(parsedEvent.context.content)
            } else if (eventData[i] === "[REFERENCES]") {
              let refData = eventData.slice(i + 1).map(line => line.trim());

              for (let j = 0; j < refData.length; j++) {
                if (refData[j] === "[PRIORITY]") {
                  break
                }

                const regex = /\[(.*?)\]\((.*?)\)/;
                const match = refData[j].match(regex);

                if (!match) {
                  parsedEvent.context.references.push({
                    title: refData[j],
                    url: refData[j]
                  });
                } else {
                  parsedEvent.context.references.push({
                    title: match[1],
                    url: match[2]
                  })
                }
              }
            } else if (eventData[i] === "[PRIORITY]") {
              parsedEvent.priority = PRIORITY[eventData[i + 1].toUpperCase()];
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