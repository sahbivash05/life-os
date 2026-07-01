import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import isoWeek from "dayjs/plugin/isoWeek";
import localizedFormat from "dayjs/plugin/localizedFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(advancedFormat);
dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.extend(weekOfYear);

export { dayjs };

