// "use client"

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"


// interface RoleSelectProps {
//   value: "applicant" | "employer"   
//   onChange: (value: "applicant" | "employer") => void
// }

// const RoleSelect:React.FC<RoleSelectProps>=({value,onChange})=>{
//    const items = [
//     { label: "Applicant", value: "applicant" },
//     { label: "Employer", value: "employer" },
//   ]

// return(
//     <div>

// <Select value={value} onValueChange={(newValue) => {
//     onChange(newValue as "applicant" | "employer")
//   }}  >
//   <SelectTrigger className="w-[180px]">
//     <SelectValue placeholder="Job Applicant" />
//   </SelectTrigger>
//   <SelectContent>
//     <SelectGroup>
//       {items.map((item) => (
//         <SelectItem key={item.value} value={item.value}>
//           {item.label}
//         </SelectItem>
//       ))}
//     </SelectGroup>
//   </SelectContent>
// </Select>
//     </div>
// )
// }


// export default RoleSelect;