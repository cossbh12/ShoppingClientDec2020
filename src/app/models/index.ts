// {id: 14, for: "Jeff", items: "1,2", pickupDate: "2020-12-08T22:00:12.9539753-05:00", status: "Processing"
export interface OrderResponse {
  id: string;
  for: string;
  items: string;
  pickupDate: Date,
  status: string;
  message?: string;
}

export interface OrderCreate {
  for: string;
  items: string;
}
