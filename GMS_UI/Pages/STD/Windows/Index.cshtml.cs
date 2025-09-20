using GMS.BL.Generic;
using GMS.Objects.API;
using GMS.Objects.CMN;
using GMS.Objects.General;
using GMS.Objects.STD;
using GMS_UI.Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;


namespace GMS_UI.Pages.STD.Windows
{
    //[IgnoreAntiforgeryToken]
    //public class VisitWindowDefinitionsModel : PageModel
    //{
        //private readonly ApplicationDbContext _context;
        //public VisitWindowDefinitionsModel(ApplicationDbContext context)
        //{
        //    _context = context;
        //}

        // GET: Render page
        //public void OnGet() { }

        // GET: /VisitWindowDefinitions?handler=Load
        //public async Task<JsonResult> OnGetLoadAsync()
        //{
        //    //var list = await _context.VisitWindowDefinitions
        //    //    .Select(v => new {
        //    //        v.VisitId,
        //    //        v.VisitName,
        //    //        v.DayOffset,
        //    //        v.WindowPreDays,
        //    //        v.WindowPostDays,
        //    //        v.VisitOrder
        //    //    })
        //    //    .ToListAsync();
        //    //return new JsonResult(list);
        //}

        // GET: /VisitWindowDefinitions?handler=Get&id=1
        //public async Task<JsonResult> OnGetGetAsync(int id)
        //{
        //    var v = await _context.VisitWindowDefinitions.FindAsync(id);
        //    if (v == null)
        //        return new JsonResult(NotFound());

        //    return new JsonResult(new
        //    {
        //        v.VisitId,
        //        v.VisitName,
        //        v.DayOffset,
        //        v.WindowPreDays,
        //        v.WindowPostDays,
        //        v.VisitOrder
        //    });
        //}

        // POST: Create new
        //public async Task<IActionResult> OnPostCreateAsync([FromBody, BindRequired] VisitWindowDefinition input)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    _context.VisitWindowDefinitions.Add(input);
        //    await _context.SaveChangesAsync();
        //    return new JsonResult(input);
        //}

        //// PUT: Edit existing
        //public async Task<IActionResult> OnPutEditAsync([FromBody, BindRequired] VisitWindowDefinition input)
        //{
        //    var v = await _context.VisitWindowDefinitions.FindAsync(input.VisitId);
        //    if (v == null)
        //        return NotFound();

        //    v.VisitName = input.VisitName;
        //    v.DayOffset = input.DayOffset;
        //    v.WindowPreDays = input.WindowPreDays;
        //    v.WindowPostDays = input.WindowPostDays;
        //    v.VisitOrder = input.VisitOrder;

        //    await _context.SaveChangesAsync();
        //    return new JsonResult(v);
        //}

        //// DELETE: Remove
        //public async Task<IActionResult> OnDeleteDeleteAsync(int id)
        //{
        //    var v = await _context.VisitWindowDefinitions.FindAsync(id);
        //    if (v == null)
        //        return NotFound();

        //    _context.VisitWindowDefinitions.Remove(v);
        //    await _context.SaveChangesAsync();
        //    return new JsonResult(new { success = true });
        //}
    //}
}
