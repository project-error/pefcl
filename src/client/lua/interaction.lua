local config = json.decode(LoadResourceFile(GetCurrentResourceName(), "config.json"))
local bank_coords = config.bankBlips.coords
local atm_props = config.atms.props
local text

function display_help_text(text)
  BeginTextCommandDisplayHelp("STRING")
  AddTextComponentString(text)
  EndTextCommandDisplayHelp(0, true, false, -1)
end

CreateThread(function ()

  if not config.target.enabled then
    while true do
      local player_id = PlayerPedId()
      local player_coords = GetEntityCoords(player_id)
      local sleep = 1000

      for i = 1, #bank_coords do
        local pos = bank_coords[i]

        local dist = #(player_coords - vector3(pos.x, pos.y, pos.z))
        if dist <= 10.0 then
          DrawMarker(2, pos.x, pos.y, pos.z, 0.0, 0.0, 0.0, 0.0, 180.0, 0.0, 0.5, 0.5, 0.3, 255, 255, 255, 50, false, true, 2, nil, nil, false)

          if dist <= 3.5 then
            local text = "Open bank: ~INPUT_PICKUP~"
            display_help_text(text)

            if IsControlJustReleased(0, 38) then
              exports["pefcl"]:openBank()
            end
          else
            ClearHelp(true)
          end


          sleep = 0
        end
      end

      for i = 1, #atm_props do
        local prop = GetClosestObjectOfType(player_coords, 5.0, joaat(atm_props[i]), false, false, false)
        local pos = GetEntityCoords(prop)
        local dist = #(player_coords - pos)
        
        if dist <= 2.0 then
          local text = "Open atm: ~INPUT_PICKUP~"
          display_help_text(text)

          if IsControlJustReleased(0, 38) then
            exports["pefcl"]:openAtm()
          end

          sleep = 0
        else
          ClearHelp(true)
        end
      end

      Wait(sleep)
    end
  end
end)
