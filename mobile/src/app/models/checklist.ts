// title="https://app.fancycan.com/fleet/checklist/BYD?item=tire2&loc=rear%20left"
export interface Checklist {
  vcode: string;
  item: string;
  location: string;
  status: boolean;
  value: string;
  condition: string;
}

export const defaultChecklist: Checklist = {
    vcode: '',
    item: '',
    location: '',
    status: false,
    value: '',
    condition: ''
}
