using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace GMS_UI.Pages.STD.StudioData
{
    public class IndexModel : PageModel
    {
        public void OnGet() { }
        public IActionResult OnPost()
        {
            return RedirectToPage("/Index");
        }
    }

}