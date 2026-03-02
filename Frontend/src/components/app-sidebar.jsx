import {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
//import AlertBasic from "./Alert"
import { ICON_MAP } from "@/helper/iconRegistry"
import { DockIcon} from "lucide-react"
import { useUserContext } from "@/context/userContext"
const data = {
  
  navMain: [
  ],
  navSecondary: [
    /**
     * {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
     */
  ],
}


export function AppSidebar({  ...props}) {

  const [user, setUser] = useState({});
  const {setIsUserLoggedIn} = useUserContext();
  
  const navigate = useNavigate();
  useEffect(function(){
    async function fetchData() {
      try{
        const response = await fetch("http://localhost:5000/api/v1/dashboard",{
          method: "GET",
          credentials: "include",
        });

        if(!response.ok){
          return props.setAlert({type:"error", message: response.message || "fetch failed"});
        }

        const data = await response.json();
        //console.log("Data received is ",data.message);
        data.message.menuitems = data.message.menuitems
                          .map((item) => ({
                              ...item,
                              icon: ICON_MAP[item.icon]
                          }))
                          .map((obj) => ({
                            ...obj,
                            children: obj.children 
                            ? obj.children.map((key) => ({
                              ...key,
                              icon: ICON_MAP[key.icon]
                            }))
                            : undefined
                          }))
        //console.log(data.message.menuitems);
        setUser(data.message);
      }catch(err){
        props.setAlert({type: "error", message: err.message || "Network error" });
      }      
    }
    fetchData();
  },[]);

  async function handleLogout(){
    const res = await fetch("http://localhost:5000/api/v1/auth/logout",{
      method: "DELETE",
      credentials: "include"
    })

    if(!res.ok)return props.setAlert({type: "error", message: res.message || "Error occurred"})

    const response = await res.json();
    props.setAlert({type:"success", message:response.message || "Logged out successfully"});
    setIsUserLoggedIn(null);
    setTimeout(()=>{
      navigate("/");
    },2000);
  }
  //console.log(user);



  return (
    
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <span>
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <DockIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Certify</span>
                </div>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={user.menuitems} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logout={handleLogout}/>
      </SidebarFooter>
      
    </Sidebar>
  );
}
