import {Card,CardContent} from "@/components/ui/card"
import { Briefcase, User } from "lucide-react";

const StatsCards=({
   savedCandidates,
   openJobs,
}: {
   savedCandidates: number;
   openJobs: number;
})=>{
   return(
    <div className=" grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-6">
       <Card className="bg-blue-50 border-blue-100">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
            <div>
               <p className="text-3xl font-bold text-foreground">{savedCandidates}</p>
               <p className="text-sm text-muted-foreground">Saved Candidates</p>
            </div>

            <div className="p-3 bg-blue-100 rounded-lg">
               <Briefcase className="h-6 w-6 text-blue-600"/>
            </div>
           </div>
         </CardContent>
        </Card>


        <Card className="bg-orange-50 border-orange-100">
         <CardContent className="p-6">
           <div className="flex items-center justify-between">
            <div>
               <p className="text-3xl font-bold text-foreground">{openJobs}</p>
               <p className="text-sm text-muted-foreground">Open Jobs</p>
            </div>

            <div className="p-3 bg-orange-100 rounded-lg">
               <User className="h-6 w-6 text-blue-600"/>
            </div>
           </div>
         </CardContent>
        </Card>
    </div>
   )
}

export default StatsCards;                                                                                                              